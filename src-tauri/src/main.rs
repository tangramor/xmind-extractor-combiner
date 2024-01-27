// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::File;
use std::io::{Read, Seek, Write};
use std::path::Path;
use std::{fs, io, path};
use walkdir::{DirEntry, WalkDir};
use zip::result::ZipError;
use zip::write::FileOptions;
use zip::CompressionMethod;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
fn combine(name: &str) -> String {
    if !Path::new(name).is_dir() {
        return ZipError::FileNotFound.to_string();
    }
    println!("compress dir {name:?} ...");
    let path = Path::new(name);
    let parent = path.parent().unwrap();
    let filename = parent.join(
        path.file_name()
            .unwrap()
            .to_str()
            .unwrap()
            .replace('_', "."),
    );

    println!("compress dir {name:?} as {name:?} ...");

    let file = File::create(filename).unwrap();

    let walkdir = WalkDir::new(path);
    let it = walkdir.into_iter();

    let _ = zip_dir(
        &mut it.filter_map(|e| e.ok()),
        name,
        file,
        CompressionMethod::Stored,
    );

    format!("Folder {} have been compressed!", name)
}

#[tauri::command]
fn extract(name: &str) -> String {
    let split: Vec<&str> = name.split(".xmind").collect();
    let prefix = format!("{}_xmind", split[0]);
    let prepath = path::Path::new(&prefix);
    let file = fs::File::open(name).unwrap();

    let mut archive = zip::ZipArchive::new(file).unwrap();

    for i in 0..archive.len() {
        let mut file = archive.by_index(i).unwrap();
        let outpath = match file.enclosed_name() {
            Some(path) => (prepath.join(path)).to_owned(),
            None => continue,
        };

        {
            let comment = file.comment();
            if !comment.is_empty() {
                println!("File {i} comment: {comment}");
            }
        }

        if (*file.name()).ends_with('/') {
            println!("File {} extracted to \"{}\"", i, outpath.display());
            fs::create_dir_all(&outpath).unwrap();
        } else {
            println!(
                "File {} extracted to \"{}\" ({} bytes)",
                i,
                outpath.display(),
                file.size()
            );
            if let Some(p) = outpath.parent() {
                if !p.exists() {
                    fs::create_dir_all(p).unwrap();
                }
            }
            let mut outfile = fs::File::create(&outpath).unwrap();
            io::copy(&mut file, &mut outfile).unwrap();
        }

        // Get and Set permissions
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;

            if let Some(mode) = file.unix_mode() {
                fs::set_permissions(&outpath, fs::Permissions::from_mode(mode)).unwrap();
            }
        }
    }

    format!("File {} have been extracted!", name)
}

fn zip_dir<T>(
    it: &mut dyn Iterator<Item = DirEntry>,
    prefix: &str,
    writer: T,
    method: zip::CompressionMethod,
) -> zip::result::ZipResult<()>
where
    T: Write + Seek,
{
    let mut zip = zip::ZipWriter::new(writer);
    let options = FileOptions::default()
        .compression_method(method)
        .unix_permissions(0o755);

    let mut buffer = Vec::new();
    for entry in it {
        let path = entry.path();
        let name = path.strip_prefix(Path::new(prefix)).unwrap();

        // Write file or directory explicitly
        // Some unzip tools unzip files with directory paths correctly, some do not!
        if path.is_file() {
            println!("adding file {path:?} as {name:?} ...");
            #[allow(deprecated)]
            zip.start_file_from_path(name, options)?;
            let mut f = File::open(path)?;

            f.read_to_end(&mut buffer)?;
            zip.write_all(&buffer)?;
            buffer.clear();
        } else if !name.as_os_str().is_empty() {
            // Only if not root! Avoids path spec / warning
            // and mapname conversion failed error on unzip
            println!("adding dir {path:?} as {name:?} ...");
            #[allow(deprecated)]
            zip.add_directory_from_path(name, options)?;
        }
    }
    zip.finish()?;
    Result::Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![combine, extract])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

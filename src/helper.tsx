

export const getFileNameFromPath = function(path: string){
    var pos1 = path.lastIndexOf('/');
    var pos2 = path.lastIndexOf('\\');
    var pos  = Math.max(pos1, pos2)
    if( pos<0 )
        return path;
    else
        return path.substring(pos+1);
}
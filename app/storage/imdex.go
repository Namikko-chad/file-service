package storage

import (
	_ "file-service/app/storage/storages/db"
)



// md5 := md5.Sum(fileRaw.Payload)
// file := models.File{
//   ID:      uuid.New(),
//   EXT:     filepath.Ext(fileRaw.Filename)[1:],
//   MIME:    http.DetectContentType(fileRaw.Payload),
//   Storage: "db",
//   Hash:    hex.EncodeToString(md5[:]),
// }
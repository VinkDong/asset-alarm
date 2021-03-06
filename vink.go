package main

import (
	"github.com/VinkDong/asset-alarm/server"
	"flag"
	"github.com/VinkDong/asset-alarm/dbmanager"
	"github.com/VinkDong/asset-alarm/log"
	"database/sql"
)

var (
	dbPath = flag.String("db", "", "database path")
)

func main() {
	InitArgs()
	server.Context.DbPath = *dbPath
	log.Info("starting server...")
	InitDb()
	log.Infof("connected database: %s", *dbPath)
	server.Init()
	server.Start()
}

func InitArgs() {
	flag.Parse()
}

func InitDb() {
	db := &sql.DB{}
	dbmanager.Init(db, server.Context.DbPath)
	if !dbmanager.Exists(db, "credit") {
		dbmanager.InitTables(db)
	}
	if !dbmanager.Exists(db, "record") {
		dbmanager.InitRecordTable(db)
	}
	if !dbmanager.Exists(db, "bill") {
		dbmanager.InitBillTable(db)
	}

	server.Context.Db = db
}

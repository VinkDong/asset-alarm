package server

import (
	"database/sql"
	"github.com/VinkDong/asset-alarm/log"
	"github.com/bitly/go-simplejson"
)

type Bill struct {
	Id       int64
	CreditId int64
	Year     int
	Month    int
	Day      int
	Amount   float64
	Balance  float64 `show total balance`
	Credit   float64 `This month of credit`
}

func (b *Bill) Save() {
	CommonSave(b,"bill")

}

func (b *Bill) ConvertFormRow(rows *sql.Rows) error {
	var err error
	if err = rows.Scan(&b.Id, &b.CreditId, &b.Year, &b.Month, &b.Day, &b.Amount, &b.Balance, &b.Credit); err != nil {
		log.Error("convert rows to credit object error")
	}
	return err
}

func (b *Bill) ToJsonString() string {
	jsonStr := CommonToJsonStr(b)
	return jsonStr
}

func (b *Bill) ToJsonObj() (*simplejson.Json, error) {
	jsonStr := b.ToJsonString()
	js, err := simplejson.NewJson([]byte(jsonStr))
	return js, err
}

func (b *Bill) List() []Bill {
	stmtSql := `select * from bill `
	r, err := Context.Db.Query(stmtSql)
	if err != nil {
		log.Errorf("can't exec query %s", stmtSql)
		return nil
	}
	bList := make([]Bill, 0)
	for ; r.Next(); {
		var q Bill
		err = q.ConvertFormRow(r)
		bList = append(bList, q)
	}
	r.Close()
	return bList
}
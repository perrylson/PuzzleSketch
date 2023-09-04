package main

import(
	"fmt"
	"log"
	"net/http"
    "github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"database/sql"
	"time"
	"github.com/gin-contrib/cors"
)

type gameLog struct {
	ID int `json:"id"`
	Username string `json:"username"`
	IsWin int `json:"isWin"`
}


var db *sql.DB



func main(){

	var err error
	// Connect to the database container with the corresponding login credentials.
	fmt.Println("Connecting to db")
	db, err = sql.Open("mysql", "user:setABetterPassword@tcp(sql-db:3306)/logdb")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()


	fmt.Println("Connected")

	// create a new table
	fmt.Println("Creating table")
	if _, err := db.Exec(`
	CREATE TABLE IF NOT EXISTS GameLogs (
		ID INT NOT NULL AUTO_INCREMENT,
		Username VARCHAR(255),
		IsWin INT CHECK (IsWin = 1 OR IsWin = 0),
		PRIMARY KEY (ID)
	);`); err != nil {
		log.Fatal(err)
	}

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET, POST, DELETE"},
		AllowHeaders:     []string{"Content-Type", "Content-Length", "Accept-Encoding", "Authorization", "Cache-Control"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("/logs", getLogs)
	router.GET("/logs/:id", getLogByID)
	router.POST("/logs", postLog)
  	router.DELETE("/logs", deleteLogs)

	router.Run("0.0.0.0:8080")
}


func deleteLogs(c *gin.Context){
	if _, err := db.Exec("DELETE FROM GameLogs;"); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": err.Error()})
	}  else {
		c.Status(http.StatusNoContent)
	}

}

func getLogs(c *gin.Context){
	var logs []gameLog

	result, err := db.Query("SELECT * FROM GameLogs;")

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": err.Error()})
		return
	}

	defer result.Close()

	for result.Next() {
		var log gameLog
		if err := result.Scan(&log.ID, &log.Username, &log.IsWin); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": err.Error()})
			return
		} else {
			logs = append(logs, log)
		}
	}
	c.JSON(http.StatusOK, logs)
	
}

func getLogByID(c *gin.Context){
	var log gameLog
	id := c.Param("id")


	if err := db.QueryRow(`SELECT ID, Username, IsWin FROM GameLogs WHERE ID=?;`, id).Scan(&log.ID, &log.Username, &log.IsWin); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": err.Error()})

	} else{
		c.JSON(http.StatusOK, log)
	}
}

func postLog(c *gin.Context){
	var newLog gameLog

	

	if err := c.BindJSON(&newLog); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"errorMessage": err.Error()})
		return
	}

	if _, err := db.Exec("INSERT INTO GameLogs (Username, IsWin) VALUES (?, ?);", newLog.Username, newLog.IsWin); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": err.Error()})
	} else {
		c.Status(http.StatusNoContent)
	}
}


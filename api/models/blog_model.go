package models

type Blog struct {
	Title  string `binding:"required" form:"title"`
	Author string `binding:"required" form:"author"`
	Body   string `binding:"required" form:"body"`
}

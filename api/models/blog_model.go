package models

// response
type Blog struct {
	Title  string `binding:"required" form:"title" json:"title"`
	Author string `binding:"required" form:"author" json:"author"`
	Body   string `binding:"required" form:"body" json:"body"`
}

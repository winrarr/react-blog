package models

// request, response
type Blog struct {
	ID     string `bson:"_id,omitempty" json:"id"`
	Title  string `binding:"required" form:"title" json:"title"`
	Author string `binding:"required" form:"author" json:"author"`
	Body   string `binding:"required" form:"body" json:"body"`
}

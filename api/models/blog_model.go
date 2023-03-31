package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// request, response
type Blog struct {
	ID     primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title  string             `binding:"required" form:"title" json:"title"`
	Author string             `binding:"required" form:"author" json:"author"`
	Body   string             `binding:"required" form:"body" json:"body"`
}

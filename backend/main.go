package main

import (
	"log"
	"time"
	"context"
	"os"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

type User struct {
	Name string `json:"name"`
	Role string `json:"role"` // "owner", "guest"
}

type Room struct {
	RoomName string `json:"roomName"`
	Uid string `json:"uid"`
	Users []User `json:"users"`
}

var ctx = context.Background()

func main() {

	loadEnv()
	app := fiber.New()
	redis := getRedis()

	app.Get("/", func (c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "*",
		AllowMethods: "*",
	}))
	api := app.Group("/api/v1")

	roomsApi := api.Group("/rooms")
	roomsApi.Post("/create", func(c *fiber.Ctx) error {
		var data struct {
			Body Room `json:"body"`
		}

		if err := c.BodyParser(&data); err != nil {
			log.Fatal(err)
		}

		parsed, err := json.Marshal(data.Body)
		if err != nil {
			log.Fatal(err)
		}
		redis.Set(ctx, data.Body.Uid, parsed, 59 * time.Minute).Result()

		return c.JSON(map[string]any {
			"message": "Room created successfully",
			"room_id": "1234567890",
		})
	})

	log.Fatal(app.Listen(":" + os.Getenv("BACKEND_PORT")))

}


func loadEnv() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func getRedis() *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_HOST") + ":" + os.Getenv("REDIS_PORT"),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0,
	})
}

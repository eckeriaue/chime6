package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"time"

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
		return c.SendString("ok")
	})
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "*",
		AllowMethods: "*",
	}))
	api := app.Group("/api/v1")

	roomsApi := api.Group("/rooms")
	roomsApi.Post("/", func(c *fiber.Ctx) error {
		var room Room

		if err := c.BodyParser(&room); err != nil {
			log.Printf("Parse error: %v", err)
			return c.Status(400).JSON(fiber.Map{"error": "Invalid JSON"})
		}

		parsed, err := json.Marshal(room)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Failed to marshal room"})
		}

		if result, err := redis.Set(ctx, room.Uid, parsed, 59 * time.Minute).Result(); err != nil {
			log.Printf("Redis save failed: %s", room.Uid)
			return c.Status(400).JSON(fiber.Map{ "error": "Failed to create room" })
		} else if result == "OK" {
			c.Redirect("/rooms/" + room.Uid, 201)
			return c.JSON(fiber.Map {
				"room_id": room.Uid,
				"url": "/rooms/" + room.Uid,
			})
		}
		return c.Status(400).JSON(fiber.Map{ "error": "Failed to create room" })
	})

	roomsApi.Get("/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		if id == "" {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid room ID"})
		}

		if room, err := redis.Get(ctx, id).Result(); err != nil {
			log.Printf("Redis get failed: %s", id)
			return c.Status(400).JSON(fiber.Map{ "error": "Failed to get room" })
		} else {
			return c.JSON(room)
		}

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
	var client * redis.Client = redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_HOST") + ":" + os.Getenv("REDIS_PORT"),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0,
	})

	if _, err := client.Ping(ctx).Result(); err != nil {
        log.Fatalf("Redis connection failed: %v", err)
    }
    return client
}

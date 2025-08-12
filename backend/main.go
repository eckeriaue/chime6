package main

import (
	"context"
	"encoding/json"
	"fmt"
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
	Uid string `json:"uid"`
}

type Room struct {
	RoomName string `json:"roomName"`
	Uid string `json:"uid"`
	Owner User `json:"owner"`
	Users []User `json:"users"`
}

func (r *Room) HasUser(targetUser User) bool {
    for _, user := range r.Users {
        if user.Uid == targetUser.Uid {
            return true
        }
    }
    return false
}

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

		if result, err := redis.Set(c.Context(), room.Uid, parsed, 1 * time.Hour).Result(); err != nil {
			log.Printf("Redis save failed: %s", room.Uid)
			return c.Status(400).JSON(fiber.Map{ "error": "Failed to create room" })
		} else if result == "OK" {
			return c.JSON(fiber.Map {
				"room_id": room.Uid,
				"url": "/rooms/" + room.Uid,
			})
		}
		return c.Status(400).JSON(fiber.Map{ "error": "Failed to create room" })
	})

	roomsApi.Get("/", func(c *fiber.Ctx) error {
		if keys, err := redis.Keys(c.Context(), "*").Result(); err != nil {
			log.Printf("Redis keys failed: %v", err)
			return c.Status(400).JSON(fiber.Map{ "error": "Failed to get rooms" })
		} else {
			if len(keys) == 0 {
				return c.Status(200).JSON([]Room{})
			}
			if values, err := redis.MGet(c.Context(), keys...).Result(); err != nil {
				return c.Status(400).JSON(fiber.Map{ "error": "Failed to get rooms" })
			} else {
				var rooms []Room
				for _, value := range values {
					var room Room
					if err := json.Unmarshal([]byte(value.(string)), &room); err != nil {
						log.Printf("Failed to unmarshal room: %v", err)
						continue
					}
					rooms = append(rooms, room)
				}
				return c.Status(200).JSON(rooms)
			}
		}
	})

	roomsApi.Get("/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		if id == "" {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid room ID"})
		}

		if room, err := redis.Get(c.Context(), id).Result(); err != nil {
			log.Printf("Redis get failed: %s", id)
			return c.Status(400).JSON(fiber.Map{ "error": "Failed to get room" })
		} else {
			return c.JSON(room)
		}
	})

	roomsApi.Get("/:id/users", func(c *fiber.Ctx) error {
		id := c.Params("id")
		if id == "" {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid room ID"})
		}

		if users, err := redis.Get(c.Context(), id).Result(); err != nil {
			log.Printf("Redis get failed: %s", id)
			return c.Status(400).JSON(fiber.Map{ "error": "Failed to get users" })
		} else {
			return c.JSON(users)
		}
	})

	roomsApi.Post("/:id/enter", func(c *fiber.Ctx) error {
		id := c.Params("id")
		var room Room
		var user User
		json.Unmarshal(c.Body(), &user)
		roomJsonString, err := redis.Get(c.Context(), id).Result()
		if err != nil {
			log.Printf("Redis get failed: %s", id)
			return c.Status(400).JSON(fiber.Map{ "error": "Failed to get room" })
		}

		json.Unmarshal([]byte(roomJsonString), &room)
		if (!room.HasUser(user)) {
			room.Users = append(room.Users, user)
		}

		resultRoomJson, _ := json.Marshal(room)
		redis.Set(c.Context(), room.Uid, resultRoomJson, 1 * time.Hour)

		return c.JSON(room)
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
		Addr:     fmt.Sprintf("%s:%s", os.Getenv("REDIS_HOST"), os.Getenv("REDIS_PORT")),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0,
	})

	if _, err := client.Ping(context.Background()).Result(); err != nil {
        log.Fatalf("Redis connection failed: %v", err)
    }
    return client
}

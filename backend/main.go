package main

import (
	"log"
	"github.com/joho/godotenv"
	"github.com/gofiber/fiber/v2"
	"github.com/redis/go-redis/v9"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"os"
)

// var ctx = context.Background()

func main() {
	loadEnv()
	app := fiber.New()
	// redis := getRedis()

	app.Get("/", func (c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "*",
	}))
	api := app.Group("/api/v1")

	roomsApi := api.Group("/rooms")
	roomsApi.Get("/create", func(c *fiber.Ctx) error {
		// redis.Set(ctx, "key", "value", 0)
		log.Println(string(c.Body()))
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
		Addr:     os.Getenv("REDIS_HOST"),
		Password: os.Getenv("REDIS_PASSWORD"),
	})
}

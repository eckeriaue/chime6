package storage

import (
	"os"
	"fmt"
	"log"
	"context"
	"time"
	"github.com/redis/go-redis/v9"
)

func getRedis() *redis.Client {
	var client *redis.Client = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", os.Getenv("REDIS_HOST"), os.Getenv("REDIS_PORT")),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0,
		DialTimeout:  5 * time.Second,
	    ReadTimeout:  3 * time.Second,
	    WriteTimeout: 3 * time.Second,
	})

	if _, err := client.Ping(context.Background()).Result(); err != nil {
        log.Fatalf("Redis connection failed: %v", err)
    }
    return client
}

var client *redis.Client = getRedis()

func Get(key string) (string, error) {
	result, err := client.Get(context.Background(), key).Result()
	if err != nil {
		return "", err
	}
	return result, nil
}

func Set(key, value string) error {
	err := client.Set(context.Background(), key, value, time.Hour).Err()
	if err != nil {
		return err
	}
	return nil
}

func Close() error {
	return client.Close()
}

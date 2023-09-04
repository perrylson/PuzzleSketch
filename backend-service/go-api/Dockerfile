# Docker file for creating image of Go REST service

FROM golang:latest

WORKDIR /go-api

COPY . .

RUN go mod download
RUN go build -o webService .

EXPOSE 8080

ENTRYPOINT ./webService 

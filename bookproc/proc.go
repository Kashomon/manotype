package main

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"os"
)

const (
	LEAVES = "testdata/leavesofgrass.txt"
)

func main() {
	fmt.Printf("%v\n", "Log something")
	ReadStreaming(LEAVES)
}

func ReadAll(fname string) string {
	c, err := ioutil.ReadFile(fname)
	if err != nil {
		panic(err)
	}
	return string(c)
}

func ReadStreaming(fname string) string {
	f, errt := os.Open(fname)
	if errt != nil {
		panic(errt)
	}
	reader := bufio.NewReader(f)
	for bytes, err := reader.ReadBytes(' '); err == nil; bytes, err = reader.ReadBytes(' ') {
		word := string(bytes)
		fmt.Printf("%v\n", word)
	}
	return "z"
}

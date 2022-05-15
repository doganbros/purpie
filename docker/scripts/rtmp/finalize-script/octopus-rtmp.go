package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"strings"
)

func main() {
	fmt.Println(os.Environ())
	fmt.Println(ioutil.WriteFile("/tmp/octopus-rtmp.log", []byte(strings.Join(os.Environ(), "\n")), 0644))
}
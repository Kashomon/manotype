package manotype

import (
	"fmt"
	"math/rand"
	"time"
)

// Random number generator for creating IDs.
var r *rand.Rand

func init() {
	// Randomize the source to a new starting value.
	r = rand.New(rand.NewSource(time.Now().UTC().UnixNano()))
}

type Lesson struct {
	Chars   map[rune]bool
	Name    string
	KeyType KeyboardType // TODO(kashomon): Make an enum.
	Level   int64
}

func NewLesson(name string, keyType KeyboardType, lvl int64) *Lesson {
	m := make(map[rune]bool)
	return &Lesson{
		m,
		name,
		keyType,
		lvl,
	}
}

// Add 'valid' characters to the lesson.
func (t *Lesson) AddChars(bs ...rune) *Lesson {
	for _, b := range bs {
		t.Chars[b] = true
	}
	return t
}

// Test whether a string is valid for the lesson. Conditions:
// - Must only contain chars in the lesson.
// - Must not be empty.
func (t *Lesson) Test(str string) bool {
	notWhitespace := false
	for _, c := range str {
		_, ok := t.Chars[c]
		if !ok && c != ' ' && c != '\n' {
			return false
		}
		if c != ' ' && c != '\n' {
			notWhitespace = true
		}
	}
	return notWhitespace
}

// Merge a lesson. Use the Name, level, and KeyBoardType from the
// passed-in-lesson.
func (t *Lesson) Merge(l *Lesson) *Lesson {
	nl := NewLesson(l.Name, l.KeyType, l.Level)
	for key := range t.Chars {
		nl.Chars[key] = true
	}
	for key := range l.Chars {
		nl.Chars[key] = true
	}
	return nl
}

func (t *Lesson) RandomPractice(stringLen, avgWordLen int) string {
	out := make([]rune, stringLen, stringLen)

	numChars := len(t.Chars)
	validChars := make([]rune, numChars, numChars)
	idx := 0
	for key := range t.Chars {
		validChars[idx] = key
		idx++
	}

	for i := 0; i < stringLen; i++ {
		cidx := rand.Int()
		c := validChars[cidx%len(validChars)]
		out[i] = c
		if cidx%avgWordLen == 0 && i < stringLen-1 {
			i++
			out[i] = ' '
		}
	}
	return string(out)
}

func (t *Lesson) String() string {
	return fmt.Sprintf("%v", t.Chars)
}

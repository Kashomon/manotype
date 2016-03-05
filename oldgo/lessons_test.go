package manotype

import (
	"testing"
)

var abcd = NewLesson("Default", Qwerty, 1).
	AddChars('a', 'b', 'c', 'd')

func TestValid(t *testing.T) {
	if !abcd.Test("cab") {
		t.Errorf("Should have passed")
	}

	if abcd.Test("cabe") {
		t.Errorf("Should not have passed")
	}
}

func TestWhitespace(t *testing.T) {
	if abcd.Test("    ") {
		t.Errorf("Empty str shouldn't pass")
	}
	if abcd.Test("    \n") {
		t.Errorf("Empty str shouldn't pass")
	}
}

func TestMerge(t *testing.T) {
	ef := NewLesson("Z", Qwerty, 1).AddChars('e', 'f')
	z := abcd.Merge(ef)
	// Now make assertions about the properties.
	if z.Name != ef.Name {
		t.Errorf("Name should the passed in name")
	}

	if z.Level != ef.Level {
		t.Errorf("Level should be passed in level")
	}

	if !ef.Test("efffe") {
		t.Errorf("Should pass")
	}
	if ef.Test("efabffe") {
		t.Errorf("Shouldn't pass")
	}

	if !z.Test("abcdefababa") {
		t.Errorf("Should pass")
	}
	if z.Test("abcdefg") {
		t.Errorf("Shouldn't pass")
	}
}

func TestRandomPractice(t *testing.T) {
	r := abcd.RandomPractice(100, 5)
	if len(r) != 100 {
		t.Errorf("Len should be 100")
	}
	if !abcd.Test(r) {
		t.Errorf("Should be valid but was invalid: %v", r)
	}
}

package manotype

import ()

//
// Static Data.
//

var InMemDb *LessonDb = NewLessonDb()

type LessonName string

const (
	// Qwerty Lessons
	ASDF    LessonName = "ASDF"
	JKLsemi LessonName = "JKL;"
	GH      LessonName = "GH"
	ER      LessonName = "ER"
	UI      LessonName = "UI"
)

func (l LessonName) String() string {
	return string(l)
}

func init() {
	InMemDb.
		Store(NewLesson(string(ASDF.String()), Qwerty, 1).AddChars('a', 's', 'd', 'f')).
		Store(InMemDb.ForceGet(ASDF.String()).Merge(NewLesson(JKLsemi.String(), Qwerty, 2)).AddChars('j', 'k', 'l', ';')).
		Store(InMemDb.ForceGet(JKLsemi.String()).Merge(NewLesson(GH.String(), Qwerty, 3)).AddChars('g', 'h'))
}

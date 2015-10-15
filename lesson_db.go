package manotype

import ()

type LessonDb struct {
	lessonMap map[string]*Lesson
}

func NewLessonDb() *LessonDb {
	v := make(map[string]*Lesson)
	return &LessonDb{
		v,
	}
}

func (t *LessonDb) Store(l *Lesson) *LessonDb {
	t.lessonMap[l.Name] = l
	return t
}

func (t *LessonDb) Get(name string) (*Lesson, bool) {
	l, ok := t.lessonMap[name]
	return l, ok
}

func (t *LessonDb) ForceGet(name string) *Lesson {
	l, ok := t.lessonMap[name]
	if !ok {
		panic("Could not find entry")
	}
	return l
}

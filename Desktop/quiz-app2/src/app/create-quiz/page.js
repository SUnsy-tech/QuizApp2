"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    Plus,
    Trash2,
    CheckCircle2,
    CircleHelp,
    Trophy,
    Sparkles,
} from "lucide-react";

const CreateQuizPage = () => {
    const supabase = supabaseClient();

    const [quiz, setQuiz] = useState("");
    const [questions, setQuestions] = useState([
        {
            question: "",
            point: 0,
            answers: ["", "", "", ""],
            correctIndex: 0,
        }
    ]);

    const handleQuizName = (event) => {
        setQuiz(event.target.value);
    };

    const handleQuestion = (value, field, questionIndex) => {
        const updatedQuestion = questions.map((question, index) => {
            if (questionIndex === index) {
                return { ...question, [field]: value };
            } else {
                return question;
            }
        });

        setQuestions(updatedQuestion);
    };

    const handleAnswers = (questionIndex, answerIndex, value) => {
        const updatedQuestions = questions.map((question, qIndex) => {
            if (qIndex === questionIndex) {
                return {
                    ...question,
                    answers: question.answers.map((answer, aIndex) => {
                        if (aIndex === answerIndex) {
                            return value;
                        } else {
                            return answer;
                        }
                    }),
                };
            } else {
                return question;
            }
        });

        setQuestions(updatedQuestions);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: "",
                point: 0,
                answers: ["", "", "", ""],
                correctIndex: 0,
            },
        ]);
    };

    const createQuiz = async () => {
        const response = await supabase
            .from("quiz")
            .insert({
                quizName: quiz,
            })
            .select("*")
            .single();

        if (response.error) {
            console.error(response.error);
            return;
        }

        const quizId = response.data.id;

        for (let i = 0; i < questions.length; i++) {
            const response = await supabase
                .from("quiz_questions")
                .insert({
                    question: questions[i].question,
                    quizId: quizId,
                    point: questions[i].point,
                })
                .select("*")
                .single();

            if (response.error) {
                console.error(response.error);
                return;
            }

            const questionId = response.data.id;

            for (let j = 0; j < questions[i].answers.length; j++) {
                const { error } = await supabase
                    .from("question_answer")
                    .insert({
                        questionId: questionId,
                        answer: questions[i].answers[j],
                        isCorrect: questions[i].correctIndex === j,
                    });

                if (error) {
                    console.error(error);
                    return;
                }
            }

            console.log(response, "question");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-5 sm:px-8">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
                        <BookOpen className="h-6 w-6" />
                    </div>

                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">
                            Quiz Craft
                        </h1>
                        <p className="text-sm text-slate-500">
                            Create something worth learning.
                        </p>
                    </div>

                    <div className="ml-auto hidden items-center gap-2 sm:flex">
                        <Sparkles className="h-4 w-4 text-violet-500" />
                        <span className="text-sm font-medium text-slate-600">
                            Quiz Builder
                        </span>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
                {/* Page heading */}
                <div className="mb-8">
                    <Badge className="mb-3 border-0 bg-violet-100 text-violet-700 hover:bg-violet-100">
                        CREATE NEW QUIZ
                    </Badge>

                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Build your quiz
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                        Give your quiz a name, write your questions, set the
                        points, and choose the correct answers.
                    </p>
                </div>

                {/* Quiz name */}
                <Card className="mb-7 overflow-hidden rounded-2xl border-slate-200 shadow-sm">
                    <div className="h-1.5 bg-gradient-to-r from-violet-500 to-indigo-500" />

                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                                <BookOpen className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle className="text-lg">
                                    Quiz details
                                </CardTitle>
                                <CardDescription>
                                    Start with a clear and memorable title.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Label
                            htmlFor="quiz-name"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Quiz name
                        </Label>

                        <Input
                            id="quiz-name"
                            placeholder="e.g. Biology Chapter 1"
                            onChange={handleQuizName}
                            value={quiz}
                            className="h-12 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-violet-500"
                        />
                    </CardContent>
                </Card>

                {/* Question heading */}
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">
                            Your questions
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Add four answer choices and select the correct one.
                        </p>
                    </div>

                    <Badge
                        variant="secondary"
                        className="shrink-0 rounded-lg bg-violet-100 px-3 py-1 text-violet-700"
                    >
                        {questions.length} questions
                    </Badge>
                </div>

                {/* Questions */}
                <div className="space-y-6">
                    {questions.map((question, questionIndex) => (
                        <Card
                            key={questionIndex}
                            className="overflow-hidden rounded-2xl border-slate-200 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="flex items-center justify-between border-b bg-white px-5 py-4 sm:px-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-base font-bold text-white">
                                        {String(questionIndex + 1).padStart(
                                            2,
                                            "0"
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-slate-900">
                                            Question {questionIndex + 1}
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            Multiple choice
                                        </p>
                                    </div>
                                </div>

                                <Badge
                                    variant="outline"
                                    className="gap-1.5 rounded-lg border-slate-200 text-slate-600"
                                >
                                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                                    {question.point} pts
                                </Badge>
                            </div>

                            <CardContent className="space-y-6 p-5 sm:p-6">
                                {/* Question text and points */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_140px]">
                                    <div>
                                        <Label
                                            htmlFor={`question-${questionIndex}`}
                                            className="mb-2 block text-sm font-semibold text-slate-700"
                                        >
                                            Question text
                                        </Label>

                                        <Input
                                            id={`question-${questionIndex}`}
                                            placeholder="Write your question here..."
                                            value={question.question}
                                            onChange={(e) =>
                                                handleQuestion(
                                                    e.target.value,
                                                    "question",
                                                    questionIndex
                                                )
                                            }
                                            className="h-12 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-violet-500"
                                        />
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor={`point-${questionIndex}`}
                                            className="mb-2 block text-sm font-semibold text-slate-700"
                                        >
                                            Points
                                        </Label>

                                        <Input
                                            id={`point-${questionIndex}`}
                                            placeholder="0"
                                            type="number"
                                            min={0}
                                            value={question.point}
                                            onChange={(event) =>
                                                handleQuestion(
                                                    Number(
                                                        event.target.value
                                                    ),
                                                    "point",
                                                    questionIndex
                                                )
                                            }
                                            className="h-12 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-violet-500"
                                        />
                                    </div>
                                </div>

                                {/* Answers */}
                                <div>
                                    <div className="mb-3 flex items-center justify-between gap-2">
                                        <Label className="text-sm font-semibold text-slate-700">
                                            Answer choices
                                        </Label>

                                        <span className="text-xs text-slate-400">
                                            Select the correct answer
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {question.answers.map(
                                            (answer, answerIndex) => {
                                                const isCorrect =
                                                    question.correctIndex ===
                                                    answerIndex;

                                                return (
                                                    <div
                                                        key={answerIndex}
                                                        className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                                                            isCorrect
                                                                ? "border-emerald-300 bg-emerald-50/70"
                                                                : "border-slate-200 bg-white hover:border-violet-200"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                                                                isCorrect
                                                                    ? "bg-emerald-500 text-white"
                                                                    : "bg-slate-100 text-slate-500"
                                                            }`}
                                                        >
                                                            {String.fromCharCode(
                                                                65 + answerIndex
                                                            )}
                                                        </div>

                                                        <Input
                                                            placeholder={`Enter answer ${String.fromCharCode(
                                                                65 + answerIndex
                                                            )}...`}
                                                            value={answer}
                                                            onChange={(e) =>
                                                                handleAnswers(
                                                                    questionIndex,
                                                                    answerIndex,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="h-10 min-w-0 border-0 bg-transparent shadow-none focus-visible:ring-0"
                                                        />

                                                        <div className="flex shrink-0 items-center gap-2">
                                                            <Checkbox
                                                                id={`correct-${questionIndex}-${answerIndex}`}
                                                                checked={
                                                                    isCorrect
                                                                }
                                                                onCheckedChange={() =>
                                                                    handleQuestion(
                                                                        answerIndex,
                                                                        "correctIndex",
                                                                        questionIndex
                                                                    )
                                                                }
                                                                className="h-5 w-5 rounded-full border-slate-300 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
                                                            />

                                                            {isCorrect && (
                                                                <CheckCircle2 className="hidden h-4 w-4 text-emerald-600 sm:block" />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>

                                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                                        <CircleHelp className="h-4 w-4 shrink-0" />
                                        Choose one answer as the correct option.
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Add question */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={addQuestion}
                    className="mt-6 h-12 w-full gap-2 rounded-xl border-dashed border-2 border-violet-300 bg-white font-semibold text-violet-700 hover:border-violet-500 hover:bg-violet-50"
                >
                    <Plus className="h-5 w-5" />
                    Add another question
                </Button>

                {/* Bottom action */}
                <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:px-6">
                    <div>
                        <p className="font-semibold text-slate-900">
                            Ready to create your quiz?
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            {questions.length} questions · 4 answers per question
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={createQuiz}
                        className="h-12 gap-2 rounded-xl bg-violet-600 px-6 font-semibold text-white shadow-sm hover:bg-violet-700"
                    >
                        <CheckCircle2 className="h-5 w-5" />
                        Create Quiz
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default CreateQuizPage;
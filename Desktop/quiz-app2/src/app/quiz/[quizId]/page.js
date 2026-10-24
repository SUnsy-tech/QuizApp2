
"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Page = () => {
    const params = useParams();
    const supabase = supabaseClient();

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const getQuizQuestions = async () => {
            const response = await supabase
                .from("quiz_questions")
                .select("*, question_answer(*)")
                .eq("quizId", params.quizId);

            if (response.error) {
                console.error(response.error);
                return;
            }

            setQuestions(response.data || []);
        };

        getQuizQuestions();
    }, [params.quizId]);

    console.log(questions, "question");

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">

                {/* Header */}
                <div className="mb-10">
                    <Badge
                        variant="secondary"
                        className="mb-4 rounded-full px-3 py-1"
                    >
                        QUIZ CRAFT
                    </Badge>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Quiz Questions
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                        Explore your questions, review the answers, and
                        test your knowledge.
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                        <Badge variant="outline" className="px-3 py-1.5">
                            {questions.length}{" "}
                            {questions.length === 1 ? "Question" : "Questions"}
                        </Badge>
                    </div>
                </div>

                {/* Questions */}
                <div className="space-y-6">
                    {questions.map((question, index) => (
                        <Card
                            key={question.id}
                            className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                        >
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                                            {String(index + 1).padStart(2, "0")}
                                        </div>

                                        <div className="min-w-0 pt-1">
                                            <CardDescription className="mb-2 text-xs font-semibold uppercase tracking-wider">
                                                Question {index + 1}
                                            </CardDescription>

                                            <CardTitle className="break-words text-lg font-semibold leading-relaxed text-slate-900 dark:text-white sm:text-xl">
                                                {question.question}
                                            </CardTitle>
                                        </div>
                                    </div>

                                    <Badge
                                        variant="secondary"
                                        className="shrink-0 rounded-lg px-3 py-1.5"
                                    >
                                        {question.point}{" "}
                                        {question.point === 1 ? "pt" : "pts"}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <Separator className="mb-5" />

                                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Answer options
                                </p>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {question.question_answer?.map(
                                        (answer, answerIndex) => (
                                            <div
                                                key={answer.id}
                                                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
                                            >
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                                    {String.fromCharCode(
                                                        65 + answerIndex
                                                    )}
                                                </div>

                                                <p className="break-words pt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
                                                    {answer.answer}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Empty state */}
                    {questions.length === 0 && (
                        <Card className="rounded-2xl border-dashed shadow-none">
                            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M8 6h13" />
                                        <path d="M8 12h13" />
                                        <path d="M8 18h13" />
                                        <path d="M3 6h.01" />
                                        <path d="M3 12h.01" />
                                        <path d="M3 18h.01" />
                                    </svg>
                                </div>

                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                    No questions yet
                                </h2>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    This quiz doesn't have any questions to
                                    display yet.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Footer */}
                {questions.length > 0 && (
                    <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        You've reached the end of your quiz questions.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
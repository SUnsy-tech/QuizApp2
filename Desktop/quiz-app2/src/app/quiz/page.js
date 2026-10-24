"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
    BookOpen,
    CalendarDays,
    Clock,
    Plus,
    ClipboardList,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
    const supabase = supabaseClient();
    const [quiz, setQuiz] = useState([]);
    const router =  useRouter();

    useEffect(() => {
        const getQuiz = async () => {
            const response = await supabase.from("quiz").select("*");
            console.log(response);
            setQuiz(response.data);
        };

        getQuiz();
    }, []);


    const handleRedirect = (quizId) => {
        router.push(`/quiz/${quizId}`)
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
                            <BookOpen className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">
                                Quiz Craft
                            </h1>
                            <p className="text-sm text-slate-500">
                                Craft your quiz. Mine your knowledge.
                            </p>
                        </div>
                    </div>

                    <Button onClick={() => router.push("/create-quiz")}
                      className="gap-2 rounded-xl bg-violet-600 hover:bg-violet-700"
                    >
                      <Plus className="h-4 w-4" />
                        Create Quiz
                      </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-8">
                    <Badge className="mb-3 border-0 bg-violet-100 text-violet-700 hover:bg-violet-100">
                        YOUR COLLECTION
                    </Badge>

                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        My Quizzes
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Explore your quizzes and keep learning something new.
                    </p>
                </div>

                {/* Quiz Statistics */}
                <Card className="mb-8 rounded-2xl border-slate-200 shadow-sm">
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                            <ClipboardList className="h-6 w-6" />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Total quizzes
                            </p>
                            <p className="text-2xl font-bold text-slate-900">
                                {quiz.length}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Quiz List */}
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                        All quizzes
                    </h3>

                    <span className="text-sm text-slate-500">
                        {quiz.length} {quiz.length === 1 ? "quiz" : "quizzes"}
                    </span>
                </div>

                {quiz.length === 0 ? (
                    <Card className="rounded-2xl border-dashed border-slate-300 bg-white shadow-sm">
                        <CardContent className="flex flex-col items-center px-6 py-16 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                                <BookOpen className="h-8 w-8" />
                            </div>

                            <h3 className="text-xl font-semibold text-slate-900">
                                No quizzes yet
                            </h3>

                            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                Your quiz collection is empty. Create your first
                                quiz and start building your knowledge.
                            </p>

                            <Button className="mt-6 gap-2 rounded-xl bg-violet-600 hover:bg-violet-700">
                                <Plus className="h-4 w-4" />
                                Create your first quiz
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {quiz.map((item) => {
                            return (
                                <Card
                                    key={item.id} onClick={() => handleRedirect(item.id)}
                                    className="group overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
                                >
                                    <div className="h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

                                    <CardHeader className="pb-3">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700 transition-colors group-hover:bg-violet-600 group-hover:text-white">
                                                <BookOpen className="h-5 w-5" />
                                            </div>

                                            <Badge
                                                variant="secondary"
                                                className="rounded-lg bg-slate-100 text-slate-600"
                                            >
                                                Quiz
                                            </Badge>
                                        </div>
                                        
                                        <CardTitle className="break-words text-lg font-bold text-slate-900">
                                            {item.quizName}
                                        </CardTitle>

                                        <CardDescription className="text-sm text-slate-500">
                                            Test your knowledge and track your learning.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
                                            <CalendarDays className="h-4 w-4 text-violet-500" />

                                            <span className="font-medium">
                                                Created:
                                            </span>

                                            <span className="truncate">
                                                {item?.created_at}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Page;
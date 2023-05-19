import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { Routes, Route } from 'react-router-dom';
import {
    // Import predefined theme
    ThemeSupa,
} from '@supabase/auth-ui-shared';
import Account from './pages/Account';
import Create from './pages/Create';
import List from './pages/Flights';
import Scheduled from './pages/Scheduled';
import Footer from './components/Footer';
import Layout from './pages/Layout';

function App() {
    const [session, setSession] = useState(null);

    // get current session
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    return (
        <div>
            {!session ? (
                // Auth UI component
                // social auth for github & google
                <div>
                    <div className='text-center py-6'>
                        <div className='py-8 flex justify-center'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='100'
                                height='100'
                                viewBox='0 0 100 100'
                            >
                                <rect
                                    width='100'
                                    height='100'
                                    rx='50'
                                    fill='#4ade80'
                                ></rect>
                                <text
                                    x='50%'
                                    y='50%'
                                    dominantBaseline='central'
                                    textAnchor='middle'
                                    fontSize='71'
                                >
                                    🛫
                                </text>
                            </svg>
                        </div>
                        <h1 className='text-4xl font-bold tracking-tight text-gray-200 sm:text-6xl'>
                            Flight Updates
                        </h1>
                        <div className='py-8 text-green-400'>
                            Never miss your flight again!
                        </div>
                    </div>
                    <div className='flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
                        <div className='w-full max-w-md space-y-8'>
                            <div>
                                <Auth
                                    supabaseClient={supabase}
                                    appearance={{
                                        theme: ThemeSupa,
                                    }}
                                    theme='dark'
                                    providers={['github', 'google']}
                                    view='sign_in'
                                    socialLayout='vertical'
                                    socialButtonSize='xlarge'
                                    onlyThirdPartyProviders={true}
                                ></Auth>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Routes>
                    <Route
                        path='/'
                        element={
                            <Layout key={session.user.id} session={session} />
                        }
                    >
                        <Route
                            element={
                                !session ? (
                                    <Auth />
                                ) : (
                                    <List
                                        key={session.user.id}
                                        session={session}
                                    />
                                )
                            }
                        />
                        <Route
                            index
                            element={
                                !session ? (
                                    <Auth />
                                ) : (
                                    <Create
                                        key={session.user.id}
                                        session={session}
                                    />
                                )
                            }
                        />
                        <Route
                            path='/account'
                            element={
                                !session ? (
                                    <Auth />
                                ) : (
                                    <Account
                                        key={session.user.id}
                                        session={session}
                                    />
                                )
                            }
                        />
                        <Route
                            path='/flights'
                            element={
                                !session ? (
                                    <Auth />
                                ) : (
                                    <List
                                        key={session.user.id}
                                        session={session}
                                    />
                                )
                            }
                        />
                        <Route
                            path='/scheduled'
                            element={
                                !session ? (
                                    <Auth />
                                ) : (
                                    <Scheduled
                                        key={session.user.id}
                                        session={session}
                                    />
                                )
                            }
                        />
                    </Route>
                </Routes>
            )}
            <Footer />
        </div>
    );
}

export default App;

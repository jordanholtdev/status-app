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
import List from './pages/List';

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
                                socialLayout='horizontal'
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <Routes>
                    <Route
                        path='/'
                        element={
                            <Account key={session.user.id} session={session} />
                        }
                    />
                    <Route
                        path='/add-flight'
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
                        path='/flights'
                        element={
                            !session ? (
                                <Auth />
                            ) : (
                                <List key={session.user.id} session={session} />
                            )
                        }
                    />
                </Routes>
            )}
        </div>
    );
}

export default App;

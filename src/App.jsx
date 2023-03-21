import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import {
    // Import predefined theme
    ThemeSupa,
} from '@supabase/auth-ui-shared';
import Dashboard from './components/Dashboard';

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
                                    variables: {
                                        default: {
                                            colors: {
                                                brand: 'red',
                                                brandButtonText: 'black',
                                            },
                                        },
                                    },
                                }}
                                providers={['github', 'google']}
                                view='sign_in'
                                socialLayout='horizontal'
                            />
                        </div>
                    </div>
                </div>
            ) : (
                // <Account key={session.user.id} session={session} />
                <Dashboard key={session.user.id} session={session} />
            )}
        </div>
    );
}

export default App;

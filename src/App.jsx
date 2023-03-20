import './App.css';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import {
    // Import predefined theme
    ThemeSupa,
} from '@supabase/auth-ui-shared';
import Account from './Account';

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
        <div className='container' style={{ padding: '50px 0 100px 0' }}>
            {!session ? (
                // Auth UI component
                // social auth for github & google
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={['github', 'google']}
                    view='sign_in'
                    socialLayout='horizontal'
                />
            ) : (
                <Account key={session.user.id} session={session} />
            )}
        </div>
    );
}

export default App;

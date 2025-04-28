import { AppBar, Box, Button, Container, Grid, Stack, TextField, Toolbar, Typography } from '@mui/material';
import { Send } from '@mui/icons-material';
import { useState } from 'react';

const StoryContainer = () => {
    const [response, setResponse] = useState('');
    const [prompt, setPrompt] = useState('');

    const handleSendOllama = async () => {
        const res = await fetch('http://localhost:8080/api/ollama', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });

        const data = await res.json();
        console.log(data);
        setResponse(data?.key);
    }

    return (
        <Box>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap>
                            CebuanoAI
                        </Typography>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box component="main" sx={{ p: 3 }}>
                <Toolbar />
                <Grid container>
                    <Grid size={{ sm: 3 }}></Grid>
                    <Grid size={{ sm: 6 }}>
                        <Stack spacing={3}>
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    label="Prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    fullWidth
                                />
                                <Button
                                    startIcon={<Send />}
                                    onClick={handleSendOllama}
                                    variant='contained'
                                >
                                    Send
                                </Button>
                            </Stack>
                            <Typography variant='h6'>Response:</Typography>
                            <Typography>{response}</Typography>
                        </Stack>
                    </Grid>
                    <Grid size={{ sm: 3 }}></Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default StoryContainer;

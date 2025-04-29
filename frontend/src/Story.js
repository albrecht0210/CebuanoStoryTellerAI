import { AppBar, Box, Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, Grid, Radio, RadioGroup, Stack, TextField, Toolbar, Typography } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { useState } from 'react';

const StoryContainer = () => {
    const [title, setTitle] = useState('');
    const [story, setStory] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [topic, setTopic] = useState('');
    const [isCustom, setIsCustom] = useState(false);
    const [translateTo, setTranslateTo] = useState('');
    const [translatedResult, setTranslatedResult] = useState('');

    const handleSendOllamaStory = async () => {
        const res = await fetch('http://localhost:8080/api/ollama/story', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic }),
        });

        const data = await res.json();
        console.log(data.response);

        // setResponse(data?.key);
        // const data = { "response": "Titulo: Ang Pag-alima sa Kalikupan\n\nIstroya: Ang mga bata sa barangay nagtigom ug basura ug nagtanom og mga kahoy. Nagtuo sila nga ang pag-alima sa kalikupan importante para sa kaugmaon. Pinaagi sa ilang mga kalihokan, nagbago ang dagway sa ilang barangay. Ang mga tanom nangatubo ug naghatag og kalipay sa tanan.\n\n1.: Unsa ang gibuhat sa mga bata sa barangay?\nKapilian: A. Nagdula sa kalsada B. Nagtanom og kahoy ug nagtigom ug basura C. Nagdaug og premyo D. Nagdula og mga board games\nTubag: B\n\n2.: Ngano nga importante ang pag-alima sa kalikupan?\nKapilian: A. Para magtubo ang mga tanom B. Para magpuyo ang mga hayop C. Para malipay ang tanan D. Para maprotektahan ang kalikupan\nTubag: D\n\n3.: Asa nagbuhat ang mga bata sa barangay sa ilang kalihokan?\nKapilian: A. Sa balay B. Sa parke C. Sa kalsada D. Sa barangay\nTubag: D\n\n4.: Kanus-a nahitabo ang kalihokan?\nKapilian: A. Sa adlaw B. Sa hapon C. Sa gabii D. Sa tunga-tunga sa adlaw\nTubag: A\n\n5.: Kinsa ang nag-alima sa kalikupan?\nKapilian: A. Ang mga bata sa barangay B. Ang mga magulang sa barangay C. Ang mga magtutudlo D. Ang mga lokal nga mag-uuma\nTubag: A" }
        const split_data = data.response.split("\n\n");
        setTitle(split_data[0].replace('Titulo: ', ''));
        setStory(split_data[1].replace('Istroya: ', '').match(/[^.]+?\./g));

        const questions_raw = [];
        for (let i = 2; i < split_data.length; i++) {
            const question = split_data[i].split('\n');
            const question_data = {}
            question_data.question = question[0];
            console.log("Question");
            console.log(question);
            const choices_list = [...question[1].matchAll(/([A-D])\. (.*?)(?= [A-D]\.|$)/g)];
            console.log(choices_list)
            const choices = choices_list.map(match => ({
                value: match[1],
                label: match[2].trim()
            }));
            question_data.choices = choices;
            question_data.answer = question[2].replace('Tubag: ', '');
            question_data.user_answer = '';
            question_data.status = 'pending';

            questions_raw.push(question_data);
        }
        setQuestions(questions_raw);
    }

    const handleSendOllamaTranslate = async () => {
        const res = await fetch('http://localhost:8080/api/ollama/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ translate: translateTo }),
        });

        const data = await res.json();
        console.log(data.response);
        setTranslatedResult(data.response);
        // setResponse(data?.key);
        // const data = { "response": "Titulo: Ang Pag-alima sa Kalikupan\n\nIstroya: Ang mga bata sa barangay nagtigom ug basura ug nagtanom og mga kahoy. Nagtuo sila nga ang pag-alima sa kalikupan importante para sa kaugmaon. Pinaagi sa ilang mga kalihokan, nagbago ang dagway sa ilang barangay. Ang mga tanom nangatubo ug naghatag og kalipay sa tanan.\n\n1.: Unsa ang gibuhat sa mga bata sa barangay?\nKapilian: A. Nagdula sa kalsada B. Nagtanom og kahoy ug nagtigom ug basura C. Nagdaug og premyo D. Nagdula og mga board games\nTubag: B\n\n2.: Ngano nga importante ang pag-alima sa kalikupan?\nKapilian: A. Para magtubo ang mga tanom B. Para magpuyo ang mga hayop C. Para malipay ang tanan D. Para maprotektahan ang kalikupan\nTubag: D\n\n3.: Asa nagbuhat ang mga bata sa barangay sa ilang kalihokan?\nKapilian: A. Sa balay B. Sa parke C. Sa kalsada D. Sa barangay\nTubag: D\n\n4.: Kanus-a nahitabo ang kalihokan?\nKapilian: A. Sa adlaw B. Sa hapon C. Sa gabii D. Sa tunga-tunga sa adlaw\nTubag: A\n\n5.: Kinsa ang nag-alima sa kalikupan?\nKapilian: A. Ang mga bata sa barangay B. Ang mga magulang sa barangay C. Ang mga magtutudlo D. Ang mga lokal nga mag-uuma\nTubag: A" }
    }

    const handleRadioChange = (event, index) => {
        const value = event.target.value;

        // Create a new copy of the questions array
        const copy_questions = [...questions];

        // Create a new copy of the specific question object
        copy_questions[index] = {
            ...copy_questions[index],
            user_answer: value
        };

        // Set the new state
        setQuestions(copy_questions);
    };

    const handleCheckClick = () => {
        const updatedQuestions = questions.map((question) => ({
            ...question,
            status: question.user_answer === question.answer ? 'correct' : 'wrong'
        }));

        setQuestions(updatedQuestions);
    };

    return (
        <Box>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                        >
                            CebuanoAI
                        </Typography>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box component="main" sx={{ px: 3, pb: 5 }}>
                <Toolbar />
                <Grid container spacing={2}>
                    <Grid size={{ sm: 1 }}></Grid>
                    <Grid size={{ sm: 5 }}>
                        <Stack spacing={3}>
                            <Typography variant="h4" textAlign="center">Story Generator</Typography>
                            <Stack direction="row" spacing={2} justifyContent="center">
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={isCustom}
                                                onChange={(event) => setIsCustom(event.target.checked)}
                                            />
                                        }
                                        label="Custom Topic"
                                    />
                                </FormGroup>
                                <TextField
                                    size="small"
                                    label="Prompt"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    fullWidth
                                    disabled={!isCustom}
                                />
                            </Stack>
                            <Button
                                onClick={handleSendOllamaStory}
                                variant='contained'
                            >
                                {!isCustom ? 'Generate Random Story' : 'Generate Story'}
                            </Button>
                            <Typography variant='h6'>{title}</Typography>
                            {story.map((sentence, index) => (
                                <Typography key={index}>{sentence}</Typography>
                            ))}
                            {questions.map((question, index) => {
                                return (
                                    <Box key={index}>
                                        <Typography>
                                            {question.question}
                                            {question.status === 'correct' && <Check fontSize="small" color='success' />}
                                            {question.status === 'wrong' && <Close fontSize="small" color='error' />}
                                        </Typography>
                                        {question.status === 'wrong' && (
                                            <Typography>Saktong tubag: {question.answer}. {question.choices.find((q) => q.value === question.answer).label}</Typography>
                                        )}
                                        <FormControl>
                                            <RadioGroup
                                                aria-labelledby={"choices-radio"}
                                                value={question.user_answer}
                                                onChange={(e) => handleRadioChange(e, index)}
                                            >
                                                {question.choices.map((choice, index) => (
                                                    <FormControlLabel key={index} value={choice.value} control={<Radio />} label={choice.label} />
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                    </Box>
                                )
                            })}
                            {story.length > 0 && (
                                <Button
                                    variant="outlined"
                                    onClick={handleCheckClick}
                                    disabled={questions.some((q) => q.user_answer === '')}
                                >
                                    Check
                                </Button>
                            )}
                        </Stack>
                    </Grid>
                    <Grid size={{ sm: 1 }}></Grid>
                    <Grid size={{ sm: 4 }}>
                        <Stack spacing={3}>
                            <Typography variant='h4' textAlign="center">Translator</Typography>
                            <TextField
                                size="small"
                                value={translateTo}
                                onChange={(e) => setTranslateTo(e.target.value)}
                                multiline
                            />
                            <Button
                                onClick={handleSendOllamaTranslate}
                            >
                                Translate
                            </Button>
                            {translatedResult !== '' && (
                                <>
                                    <Typography variant="h6">English Text:</Typography>
                                    <Typography>{translatedResult}</Typography>
                                </>
                            )}
                        </Stack>
                    </Grid>
                    <Grid size={{ sm: 1 }}></Grid>
                </Grid>
            </Box>
        </Box >
    )
}

export default StoryContainer;

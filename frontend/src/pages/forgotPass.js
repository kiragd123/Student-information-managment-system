import { Dialog, DialogTitle, DialogContent, DialogActions ,TextField,Button} from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { LightPurpleButton } from '../components/buttonStyles';
import { forgotPassword } from '../redux/userRelated/userHandle'; // new action

const ForgotPasswordDialog = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState({email:""});
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            setError(true);
            return;
        }
        dispatch(forgotPassword({ email })); // call Redux thunk
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Enter your registered email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError(false);
                    }}
                    error={error}
                    helperText={error && "Email is required"}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <LightPurpleButton onClick={handleSubmit}>Submit</LightPurpleButton>
            </DialogActions>
        </Dialog>
    );
};

export default ForgotPasswordDialog;

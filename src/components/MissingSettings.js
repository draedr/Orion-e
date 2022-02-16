import { Box, Typography, Modal } from '@mui/material';

export const MissingSettings = () => (
    <Modal
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        severity={"error"}
    >
        <Box sx={{}}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Missing Settings
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Your settings file is incomplete.
            </Typography>
        </Box>
    </Modal>
);
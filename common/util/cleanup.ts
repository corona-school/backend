type CleanupAction = () => void;

//Cleanup actions that should be executed somehow for cleanup purposes, usually called on sigterm
export const cleanupActions: CleanupAction[] = [];

export function addCleanupAction(action: CleanupAction) {
    cleanupActions?.push(action);
}

export function performCleanupActions() {
    for (let ca: () => void; ca = cleanupActions?.pop();) {
        ca();
    }
}
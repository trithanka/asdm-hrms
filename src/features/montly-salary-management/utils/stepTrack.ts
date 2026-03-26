export function getStepLabel(steptrack: number | null): string {
    switch (steptrack) {
        case null:
        case 1:
            return "In HR";
        case 2:
            return "In Finance";
        case 3:
            return "Final Draft";
        case 4:
            return "Salary Generated";
        default:
            return "Unknown";
    }
}

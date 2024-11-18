// open ai functions imports
import process from "../AIAgent/appAssistant";

export const processInput = async (req, res) => {
    try {
        const { code, programmingLanguage, course, tone, format } = req.body;
        console.log([code, programmingLanguage, course, tone, format]);
        let query = `
        Code: ${code}
        Programming Language:${programmingLanguage.name}
        Course: ${course.name}
        Learning objectives: ${course.learningObjectives}
        Tone: ${tone}
        Format: ${format}
        `;
        console.log(query);
        process(query);
        return res.status(200).json({message: "Processed input successfully"});
    } catch(error) {
        console.log(error);
        res.status(500).json({message: "Error processing input"});
    }
}
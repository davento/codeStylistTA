// open ai functions imports
import {process, newThread} from "../AIAgent/appAssistant.js";

export const processInput = async (req, res) => {
    try {
        newThread();

        const { code, programmingLanguage, course, tone, format } = req.body;
        console.log([code, programmingLanguage, course, tone, format]);
        let query = `
        The values of the variables declared on the initial prompt are the following:
        a. Name of the course: ${course.name}
        b. Description of the course: ${course.description}
        c. Learning objectives of the course: ${course.learningObjectives}
        d. Code: ${code}
        e. Programming language used:${programmingLanguage.name}
        f. Tone to use on reply: ${tone}
        g. Format to use on reply: ${format}

        With these values, please fulfill the initially stated prompt.
        `;
        console.log(query);
        process(query);
        return res.status(200).json({message: "Processed input successfully"});
    } catch(error) {
        console.log(error);
        res.status(500).json({message: "Error processing input"});
    }
}
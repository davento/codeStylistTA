import unittest
import sys
sys.path.append("../src")
import src.util as util

class TestCleanJsonResponse(unittest.TestCase):
    
    def test_valid_json(self):
        response = "```json\n[{\"key\": \"value\"}]\n```"
        cleaned_response = util.clean_json_response(response)
        self.assertEqual(cleaned_response, '[{"key": "value"}]')

    def test_invalid_json(self):
        response = "```json\n[{\"key\": \"value\",}]\n```"
        with self.assertRaises(ValueError):
            util.clean_json_response(response)

    def test_no_json_format(self):
        response = "Some other format without backticks"
        cleaned_response = util.clean_json_response(response)
        self.assertEqual(cleaned_response, response)

if __name__ == "__main__":
    unittest.main()

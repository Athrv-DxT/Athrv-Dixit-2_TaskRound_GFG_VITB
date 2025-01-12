from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import traceback
import logging
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PROBLEMS = {
    # BEGINNER LEVEL (2 questions)
    "hello_world": {
        "title": "Hello World",
        "description": "Write a function that takes a name and returns a greeting message.",
        "difficulty": "beginner",
        "function_signature": "def hello_world(name):",
        "test_cases": [
            {"input": ["John"], "expected": "Hello, John!"},
            {"input": ["Python"], "expected": "Hello, Python!"},
            {"input": ["Coder"], "expected": "Hello, Coder!"}
        ],
        "hints": ["Remember to use string concatenation or f-strings"]
    },
    "calculate_grade": {
        "title": "Grade Calculator",
        "description": "Write a function that takes a student's score (0-100) and returns their letter grade. A: 90-100, B: 80-89, C: 70-79, D: 60-69, F: below 60",
        "difficulty": "beginner",
        "function_signature": "def calculate_grade(score):",
        "test_cases": [
            {"input": [95], "expected": "A"},
            {"input": [85], "expected": "B"},
            {"input": [45], "expected": "F"},
            {"input": [75], "expected": "C"},
            {"input": [60], "expected": "D"}
        ],
        "hints": ["Use if-elif-else statements", "Check ranges from highest to lowest"]
    },

    # INTERMEDIATE LEVEL (5 questions)
    "matrix_addition": {
        "title": "Matrix Addition",
        "description": "Write a function that adds two matrices (2D lists) of the same size.",
        "difficulty": "intermediate",
        "function_signature": "def matrix_add(matrix1, matrix2):",
        "test_cases": [
            {"input": [[[1, 2], [3, 4]], [[5, 6], [7, 8]]], "expected": [[6, 8], [10, 12]]},
            {"input": [[[0, 0]], [[1, 1]]], "expected": [[1, 1]]},
            {"input": [[[1, 1], [1, 1]], [[2, 2], [2, 2]]], "expected": [[3, 3], [3, 3]]}
        ],
        "hints": ["Loop through each row and column", "Create a new matrix for results"]
    },
    "palindrome_check": {
        "title": "Palindrome Check",
        "description": "Write a function that checks if a given string is a palindrome, ignoring spaces and punctuation.",
        "difficulty": "intermediate",
        "function_signature": "def is_palindrome(text):",
        "test_cases": [
            {"input": ["A man a plan a canal Panama"], "expected": True},
            {"input": ["race a car"], "expected": False},
            {"input": ["Was it a car or a cat I saw?"], "expected": True}
        ],
        "hints": ["Remove spaces and punctuation", "Convert to lowercase"]
    },
    "prime_factors": {
        "title": "Prime Factorization",
        "description": "Write a function that returns all prime factors of a given number.",
        "difficulty": "intermediate",
        "function_signature": "def prime_factors(n):",
        "test_cases": [
            {"input": [12], "expected": [2, 2, 3]},
            {"input": [100], "expected": [2, 2, 5, 5]},
            {"input": [13], "expected": [13]}
        ],
        "hints": ["Start with smallest prime number 2", "Keep dividing until you can't"]
    },
    "binary_to_decimal": {
        "title": "Binary to Decimal",
        "description": "Convert a binary string to its decimal equivalent.",
        "difficulty": "intermediate",
        "function_signature": "def binary_to_decimal(binary_str):",
        "test_cases": [
            {"input": ["1010"], "expected": 10},
            {"input": ["1100100"], "expected": 100},
            {"input": ["11111111"], "expected": 255}
        ],
        "hints": ["Use powers of 2", "Process digits from right to left"]
    },
    "array_rotation": {
        "title": "Array Rotation",
        "description": "Rotate an array by k positions to the right.",
        "difficulty": "intermediate",
        "function_signature": "def rotate_array(arr, k):",
        "test_cases": [
            {"input": [[1, 2, 3, 4, 5], 2], "expected": [4, 5, 1, 2, 3]},
            {"input": [[1, 2, 3], 1], "expected": [3, 1, 2]},
            {"input": [[1, 2, 3, 4], 4], "expected": [1, 2, 3, 4]}
        ],
        "hints": ["Handle k > array length", "Try using array slicing"]
    },

    # PRO LEVEL (4 questions)
    "merge_intervals": {
        "title": "Merge Intervals",
        "description": "Given a list of intervals, merge all overlapping intervals.",
        "difficulty": "pro",
        "function_signature": "def merge_intervals(intervals):",
        "test_cases": [
            {"input": [[[1,3],[2,6],[8,10],[15,18]]], "expected": [[1,6],[8,10],[15,18]]},
            {"input": [[[1,4],[4,5]]], "expected": [[1,5]]},
            {"input": [[[1,4],[2,3]]], "expected": [[1,4]]}
        ],
        "hints": ["Sort intervals by start time", "Compare adjacent intervals"]
    },
    "longest_substring": {
        "title": "Longest Substring Without Repeating Characters",
        "description": "Find the length of the longest substring without repeating characters.",
        "difficulty": "pro",
        "function_signature": "def longest_substring(s):",
        "test_cases": [
            {"input": ["abcabcbb"], "expected": 3},
            {"input": ["bbbbb"], "expected": 1},
            {"input": ["pwwkew"], "expected": 3}
        ],
        "hints": ["Use sliding window", "Track character positions"]
    },
    "coin_change": {
        "title": "Coin Change Problem",
        "description": "Find the minimum number of coins needed to make a given amount.",
        "difficulty": "pro",
        "function_signature": "def coin_change(coins, amount):",
        "test_cases": [
            {"input": [[1,2,5], 11], "expected": 3},
            {"input": [[2], 3], "expected": -1},
            {"input": [[1,5,10,25], 30], "expected": 3}
        ],
        "hints": ["Use dynamic programming", "Initialize dp array with amount + 1"]
    },
    "subarray_sum": {
        "title": "Subarray Sum Equals K",
        "description": "Find the total number of subarrays that sum to target value k.",
        "difficulty": "pro",
        "function_signature": "def subarray_sum(nums, k):",
        "test_cases": [
            {"input": [[1,1,1], 2], "expected": 2},
            {"input": [[1,2,3], 3], "expected": 2},
            {"input": [[1], 0], "expected": 0}
        ],
        "hints": ["Use cumulative sum", "Track frequency of sums"]
    },

    # ADVANCED LEVEL (4 questions)
    "word_break": {
        "title": "Word Break Problem",
        "description": "Determine if a string can be segmented into words from a dictionary.",
        "difficulty": "advanced",
        "function_signature": "def word_break(s, wordDict):",
        "test_cases": [
            {"input": ["leetcode", ["leet","code"]], "expected": True},
            {"input": ["applepenapple", ["apple","pen"]], "expected": True},
            {"input": ["catsandog", ["cats","dog","sand","and","cat"]], "expected": False}
        ],
        "hints": ["Use dynamic programming", "Build solution bottom-up"]
    },
    "max_path_sum": {
        "title": "Binary Tree Maximum Path Sum",
        "description": "Find the maximum path sum in a binary tree. Path must go through at least one node.",
        "difficulty": "advanced",
        "function_signature": """
class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def max_path_sum(root):""",
        "test_cases": [
            {"input": [[1,2,3]], "expected": 6},
            {"input": [[-10,9,20,None,None,15,7]], "expected": 42},
            {"input": [[1]], "expected": 1}
        ],
        "hints": ["Use recursion", "Track global maximum"]
    },
    "regular_expression": {
        "title": "Basic Regular Expression Matching",
        "description": "Implement basic pattern matching with '.' and '*' support.",
        "difficulty": "advanced",
        "function_signature": "def is_match(text, pattern):",
        "test_cases": [
            {"input": ["aa", "a*"], "expected": True},
            {"input": ["ab", ".*"], "expected": True},
            {"input": ["mississippi", "mis*is*p*."], "expected": False}
        ],
        "hints": ["Use dynamic programming", "Handle * cases separately"]
    },
    "median_stream": {
        "title": "Median of Data Stream",
        "description": "Design a data structure that supports adding integers and finding the median.",
        "difficulty": "advanced",
        "function_signature": """
class MedianFinder:
    def __init__(self):
        pass
        
    def add_num(self, num):
        pass
        
    def find_median(self):
        pass""",
        "test_cases": [
            {"input": [["MedianFinder","addNum","findMedian","addNum","findMedian"],
                      [[],[1],[],[2],[]]], 
             "expected": [None,None,1.0,None,1.5]}
        ],
        "hints": ["Use two heaps", "Balance heaps after insertion"]
    }
}

class CodeExecutionError(Exception):
    """Custom exception for code execution errors"""
    pass

def sanitize_code(code):
    """Basic code sanitization"""
    forbidden = ['import os', 'import subprocess', 'import sys', '__import__', 
                'eval', 'exec', 'open', 'file', 'system']
    
    for term in forbidden:
        if term in code:
            raise CodeExecutionError(f"Usage of '{term}' is not allowed")
    
    return code

def execute_test_cases(function_name, code, test_cases):
    """Execute test cases safely"""
    results = []
    total_time = 0
    passed = 0
    
    namespace = {}
    
    try:
        exec(sanitize_code(code), namespace)
    except Exception as e:
        raise CodeExecutionError(f"Code execution failed: {str(e)}")
    
    if function_name not in namespace:
        raise CodeExecutionError(f"Function '{function_name}' not found")
    
    for test in test_cases:
        start_time = time.time()
        try:
            result = namespace[function_name](*test["input"])
            execution_time = time.time() - start_time
            
            if result == test["expected"]:
                passed += 1
                status = "passed"
            else:
                status = "failed"
            
            results.append({
                "status": status,
                "input": test["input"],
                "expected": test["expected"],
                "actual": result,
                "time": execution_time
            })
            
            total_time += execution_time
            
        except Exception as e:
            results.append({
                "status": "error",
                "input": test["input"],
                "error": str(e),
                "time": time.time() - start_time
            })
    
    return results, passed, total_time

@app.route('/problems', methods=['GET'])
def get_problems():
    """Get problems filtered by difficulty"""
    try:
        difficulty = request.args.get('difficulty', '').lower()
        
        if difficulty:
            filtered_problems = {
                pid: prob for pid, prob in PROBLEMS.items()
                if prob['difficulty'].lower() == difficulty
            }
            return jsonify(filtered_problems)
        
        return jsonify(PROBLEMS)
    
    except Exception as e:
        logger.error(f"Error in get_problems: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/submit', methods=['POST'])
def submit_solution():
    """Submit and evaluate a solution"""
    try:
        data = request.get_json()
        
        if not data or 'problem_id' not in data or 'code' not in data:
            return jsonify({"error": "Missing problem_id or code"}), 400
        
        problem_id = data['problem_id']
        code = data['code']
        
        if problem_id not in PROBLEMS:
            return jsonify({"error": "Problem not found"}), 404
        
        problem = PROBLEMS[problem_id]
        results, passed, total_time = execute_test_cases(
            problem_id, 
            code, 
            problem['test_cases']
        )
        
        total_tests = len(problem['test_cases'])
        score = (passed / total_tests) * 100
        
        logger.info(f"Submission for {problem_id}: Score {score}%")
        
        return jsonify({
            "status": "completed",
            "score": score,
            "average_time": total_time / total_tests if total_tests > 0 else 0,
            "results": results,
            "passed": passed,
            "total": total_tests
        })
        
    except CodeExecutionError as e:
        return jsonify({
            "status": "error",
            "error": str(e),
            "score": 0
        }), 400
        
    except Exception as e:
        logger.error(f"Error in submit_solution: {str(e)}\n{traceback.format_exc()}")
        return jsonify({
            "status": "error",
            "error": "Internal server error",
            "score": 0
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    })

if __name__ == "__main__":
    app.run(debug=True)
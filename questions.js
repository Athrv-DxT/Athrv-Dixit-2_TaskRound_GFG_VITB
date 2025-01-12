const PROBLEMS = {
    beginner: {
        hello_world: {
            title: "Hello World",
            description: "Write a function that takes a name and returns a greeting message.",
            functionSignature: "def hello_world(name):",
            testCases: [
                {input: ["John"], expected: "Hello, John!"},
                {input: ["Python"], expected: "Hello, Python!"},
                {input: ["Coder"], expected: "Hello, Coder!"}
            ],
            hints: ["Remember to use string concatenation or f-strings"]
        },
        calculate_grade: {
            title: "Grade Calculator",
            description: "Write a function that takes a students score (0-100) and returns their letter grade. A: 90-100, B: 80-89, C: 70-79, D: 60-69, F: below 60",
            functionSignature: "def calculate_grade(score):",
            testCases: [
                {input: [95], expected: "A"},
                {input: [85], expected: "B"},
                {input: [45], expected: "F"},
                {input: [75], expected: "C"},
                {input: [60], expected: "D"}
            ],
            hints: ["Use if-elif-else statements", "Check ranges from hghest to lowest"]
        }
    },
    
    intermediate: {
        matrix_addition: {
            title: "Matrix Addition",
            description: "Write a funcction that adds two matrices (2D lists) of the same size.",
            functionSignature: "def matrix_add(matrix1, matrix2):",
            testCases: [
                {input: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]], expected: [[6, 8], [10, 12]]},
                {input: [[[0, 0]], [[1, 1]]], expected: [[1, 1]]},
                {input: [[[1, 1], [1, 1]], [[2, 2], [2, 2]]], expected: [[3, 3], [3, 3]]}
            ],
            hints: ["Loop through each row and column", "Create a new matrix for results"]
        },
        palindrome_check: {
            title: "Palindrome Check",
            description: "Write a function that checks if a given string is a palindrome, ignoring spaces and punctuation.",
            functionSignature: "def is_palindrome(text):",
            testCases: [
                {input: ["A man a plan a canal Panama"], expected: true},
                {input: ["race a car"], expected: false},
                {input: ["Was it a car or a cat I saw?"], expected: true}
            ],
            hints: ["Remove spaces and punctuation", "Convert to lowercase"]
        },
        prime_factors: {
            title: "Prime Factorization",
            description: "Write a function that returns all prime factors of a given number.",
            functionSignature: "def prime_factors(n):",
            testCases: [
                {input: [12], expected: [2, 2, 3]},
                {input: [100], expected: [2, 2, 5, 5]},
                {input: [13], expected: [13]}
            ],
            hints: ["Start with smallest prime number 2", "Keep dividing until you can't"]
        },
        binary_to_decimal: {
            title: "Binary to Decimal",
            description: "Convert a binary string to its decimal equivalent.",
            functionSignature: "def binary_to_decimal(binary_str):",
            testCases: [
                {input: ["1010"], expected: 10},
                {input: ["1100100"], expected: 100},
                {input: ["11111111"], expected: 255}
            ],
            hints: ["Use powers of 2", "Process digits from right to left"]
        },
        array_rotation: {
            title: "Array Rotation",
            description: "Rotate an array by k positions to the right.",
            functionSignature: "def rotate_array(arr, k):",
            testCases: [
                {input: [[1, 2, 3, 4, 5], 2], expected: [4, 5, 1, 2, 3]},
                {input: [[1, 2, 3], 1], expected: [3, 1, 2]},
                {input: [[1, 2, 3, 4], 4], expected: [1, 2, 3, 4]}
            ],
            hints: ["Handle k > array length", "Try using array slicing"]
        }
    },
    
    pro: {
        merge_intervals: {
            title: "Merge Intervals",
            description: "Given a list of intervals, merge all overlapping intervals.",
            functionSignature: "def merge_intervals(intervals):",
            testCases: [
                {input: [[[1,3],[2,6],[8,10],[15,18]]], expected: [[1,6],[8,10],[15,18]]},
                {input: [[[1,4],[4,5]]], expected: [[1,5]]},
                {input: [[[1,4],[2,3]]], expected: [[1,4]]}
            ],
            hints: ["Sort intervals by start time", "Compare adjacent intervals"]
        },
        longest_substring: {
            title: "Longest Substring Without Repeating Characters",
            description: "Find the length of the longest substring without repeating characters.",
            functionSignature: "def longest_substring(s):",
            testCases: [
                {input: ["abcabcbb"], expected: 3},
                {input: ["bbbbb"], expected: 1},
                {input: ["pwwkew"], expected: 3}
            ],
            hints: ["Use sliding window", "Track character positions"]
        },
        coin_change: {
            title: "Coin Change Problem",
            description: "Find the minimum number of coins needed to make a given amount.",
            functionSignature: "def coin_change(coins, amount):",
            testCases: [
                {input: [[1,2,5], 11], expected: 3},
                {input: [[2], 3], expected: -1},
                {input: [[1,5,10,25], 30], expected: 3}
            ],
            hints: ["Use dynamic programming", "Initialize dp array with amount + 1"]
        },
        subarray_sum: {
            title: "Subarray Sum Equals K",
            description: "Find the total number of subarrays that sum to target value k.",
            functionSignature: "def subarray_sum(nums, k):",
            testCases: [
                {input: [[1,1,1], 2], expected: 2},
                {input: [[1,2,3], 3], expected: 2},
                {input: [[1], 0], expected: 0}
            ],
            hints: ["Use cumulative sum", "Track frequency of sums"]
        }
    },
    
    advanced: {
        word_break: {
            title: "Word Break Problem",
            description: "Determine if astring can be segmented into words from a dictionary.",
            functionSignature: "def word_break(s, wordDict):",
            testCases: [
                {input: ["leetcode", ["leet","code"]], expected: true},
                {input: ["applepenapple", ["apple","pen"]], expected: true},
                {input: ["catsandog", ["cats","dog","sand","and","cat"]], expected: false}
            ],
            hints: ["Use dynamic programming", "Build solution bottom-up"]
        },
        max_path_sum: {
            title: "Binary Tree Maximum Path Sum",
            description: "Find the maximum path sum in a binary tree. Path must go through at least one node.",
            functionSignature: `class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def max_path_sum(root):`,
            testCases: [
                {input: [[1,2,3]], expected: 6},
                {input: [[-10,9,20,null,null,15,7]], expected: 42},
                {input: [[1]], expected: 1}
            ],
            hints: ["Use recursion", "Track global maximum"]
        },
        regular_expression: {
            title: "Basic Regular Expression Matching",
            description: "Implement basic pattern matching with '.' and '*' support.",
            functionSignature: "def is_match(text, pattern):",
            testCases: [
                {input: ["aa", "a*"], expected: true},
                {input: ["ab", ".*"], expected: true},
                {input: ["mississippi", "mis*is*p*."], expected: false}
            ],
            hints: ["Use dynamic programming", "Handle * cases separately"]
        },
        median_stream: {
            title: "Median of Data Stream",
            description: "Design a data structure that supports adding integers and finding the median.",
            functionSignature: `class MedianFinder:
    def __init__(self):
        pass
        
    def add_num(self, num):
        pass
        
    def find_median(self):
        pass`,
            testCases: [
                {
                    input: [["MedianFinder","addNum","findMedian","addNum","findMedian"],[[],[1],[],[2],[]]],
                    expected: [null,null,1.0,null,1.5]
                }
            ],
            hints: ["Use two heaps", "Balance heaps after insertion"]
        }
    }
};

const PROBLEM_COUNTS = {
    beginner: Object.keys(PROBLEMS.beginner).length,
    intermediate: Object.keys(PROBLEMS.intermediate).length,
    pro: Object.keys(PROBLEMS.pro).length,
    advanced: Object.keys(PROBLEMS.advanced).length
};
function twoSum(nums: number[], target: number): number[] {
	const idx = []
	let sum = 0
	for (let i = 0; i < nums.length; i++) {
		console.log(sum, idx)
		idx.push(i)
		sum += nums[i]!
		if (sum === target) {
			return idx
		}
		if (idx.length > 2) {
			idx.shift()
		}
	}
	return idx
}

console.log(twoSum([3, 2, 4], 6))
// console.log(twoSum([3, 3], 6))
// console.log(twoSum([2, 7, 11, 15], 9))

<template>
	<div class="demo">
		<form>
			<div class="form-group">
				<label>默认</label>
				<input data-mode class="form-control" v-model="value" />
				<textarea data-mode class="form-control" v-model="value3"></textarea>
				<a-input v-model:value="value2" data-mode placeholder="Basic usage" />
				<a-textarea v-model:value="value1" data-mode placeholder="Autosize height based on content lines" auto-size />
			</div>
			<!-- <div class="form-group">
				<label>文本域支持</label>
				<textarea data-mode class="form-control" v-model="value"></textarea>
			</div>
			<div class="form-group">
				<label>英文键盘</label>
				<input data-mode="en" class="form-control" v-model="value" />
			</div>
			<div class="form-group">
				<label>数字键盘</label>
				<input data-mode="number" class="form-control" v-model="value" />
			</div>
			<div class="form-group">
				<label>标点键盘</label>
				<input data-mode="symbol" class="form-control" v-model="value" />
			</div>
			<div class="form-group">
				<label>手写键盘</label>
				<input data-mode="handwrite" class="form-control" v-model="value" />
			</div> -->
		</form>
		<KeyBoard modal @change="change" />
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref<string>('你好')
const value1 = ref<string>('')
const value2 = ref<string>('')
const value3 = ref<string>('')
const change = () => {
	console.log(value.value, value1.value, value2.value, value3.value)
}
</script>

<style lang="less">
.demo {
	width: 100%;
	height: 100%;
	font-size: 30px;
	font-weight: 400;
	line-height: 1.5;
	color: #212529;
	text-align: left;
	display: flex;
	justify-content: center;

	form {
		margin-top: 100px;
		width: 80%;
		height: 500px;

		.form-group {
			margin-bottom: 32px;

			label {
				display: inline-block;
				margin-bottom: 16px;
			}

			.form-control {
				display: block;
				width: 100%;
				height: 48px;
				padding: 12px 24px;
				font-size: 32px;
				font-weight: 400;
				line-height: 1.5;
				color: #495057;
				background-color: #fff;
				background-clip: padding-box;
				border: 1px solid #ced4da;
				border-radius: 8px;
				transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

				&:focus {
					color: #495057;
					background-color: #fff;
					border-color: #80bdff;
					outline: 0;
					box-shadow: 0 0 0 6px rgba(0, 123, 255, 0.25);
				}
			}
		}
	}
}
</style>

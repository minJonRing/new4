<template>
	<div class="e-upload">
		<el-upload :show-file-list="false" v-loading="loading" :element-loading-text="progress + '%'"
			class="e-avatar-uploader" action="#" :before-upload="beforeAvatarUpload"
			:http-request="handleUploadLearnSignVoucherFileChange" :attr-icon="'注:只能上传' + type.join()"
			:style="{ width: cwidth, height }">
			<img ref="img" v-if="image" :src="image" @load="handleLoad" class="image">
			<i v-else class="el-icon el-icon-upload2" />
		</el-upload>
	</div>
</template>
  
<script>
import { rulesT } from "tqr";
export default {
	name: "UploadProT",
	props: {
		// 赋值的值
		model: rulesT.Any,
		// 是否只读
		read: rulesT.Boolean,
		// 上传地址
		url: rulesT.String,
		// 删除地址
		deleteUrl: rulesT.String,
		// 文件类型
		type: {
			type: Array,
			default: () => ["image"],
		},
		// 文件大小
		size: {
			type: Number,
			default: 80,
		},
		// 上传额外参数
		param: rulesT.Object,
		// 对返回的数据进行处理 {fileName,filePath}
		filterData: {
			type: Function,
		},
		// 上传模块的宽高 ，显示图片的宽高
		width: {
			type: String,
			default: "100px",
		},
		height: {
			type: String,
			default: "100px",
		},
		auto: {
			type: Boolean,
			default: false
		}
	},
	// v-model 双向绑定
	model: {
		prop: "model",
		event: "change",
	},
	data() {
		return {
			loading: false,
			progress: 0,
			cwidth: this.width
		};
	},
	computed: {
		// 当前页面绑定值
		image: {
			get() {
				return this.model;
			},
			set(data) {
				this.$emit("change", data);
			},
		},
	},
	created() { },
	methods: {
		// 上传前文件判断
		beforeAvatarUpload(file) {
			const isType =
				this.type.filter((i) => {
					return (
						new RegExp(i).test(file.type) ||
						i === file.name.replace(/.+(?=\.)|\./g, "")
					);
				}).length > 0;
			const isSize = file.size / 1024 / 1024 < this.size;
			if (!isType) {
				this.$message.error(`请上传格式正确的文件 [ ${this.type.join(",")} ] `);
			}
			if (!isSize) {
				this.$message.error(`上传文件大小不能超过${this.size}MB!`);
			}
			return isType && isSize;
		},
		// 上传成功 文件处理
		handleUploadLearnSignVoucherFileChange(files) {
			this.$global.loading = true;
			const { file } = files;
			let formData = new FormData();
			formData.append("file", file);
			// 额外参数
			const keys = Object.keys(this.param);
			if (keys.length) {
				keys.map((i) => {
					formData.append(i, this.param[i]);
				});
			}
			this.$AJAX({
				url: this.url,
				method: "post",
				data: formData,
				onUploadProgress: ({ loaded, total }) => {
					this.progress = Math.ceil((loaded / total) * 100);
				},
			})
				.then(({ data }) => {
					const { url } = data;
					console.log(url)
					this.image = url
				})
				.finally(() => {
					this.$global.loading = false;
				});
		},
		handleDelete(item, i) {
			this.image = ''
		},
		handleLoad(e) {
			const img = new Image()
			img.src = this.image
			img.onload = (e) => {
				const { width, height } = img;
				const _w = width / height * +this.height.replace(/(px)/g, '');
				if (this.auto) {
					this.cwidth = _w + 'px'
				}
			}
		}
	},
};
</script>
  
<style lang="scss" scoped>
.e-upload {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	user-select: none;

	.e-avatar-uploader {
		position: relative;
		margin: 3px 6px 3px 0;
		transition-duration: 600ms;

		.image {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
			image-rendering: auto;
			border-radius: 4px;
			border: 1px dashed #666;
		}

		::v-deep .el-upload {
			display: block;
			width: 100%;

			height: 100%;
			box-sizing: border-box;

			.el-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				border: 1px dashed #666;
				border-radius: 6px;
				box-sizing: border-box;
				cursor: pointer;
				font-size: 28px;
				color: #8c939d;
				width: 100%;
				height: 100%;
				transition-duration: 600ms;
				opacity: 0.6;

				&:hover {
					border-color: #409eff;
					color: #409eff;
				}
			}
		}
	}

}
</style>
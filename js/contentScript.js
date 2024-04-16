// 注入页面的脚本
const targetCricle = document.createElement('div')
targetCricle.classList.add('wrapper')
document.body.appendChild(targetCricle)

document.addEventListener('mousemove', e => {
    const x = e.clientX
    const y = e.clientY
    updatePosition(x, y)
    drawImage(x, y)
})

function updatePosition (x, y) {
    targetCricle.style.left = `${x}px`
    targetCricle.style.top = `${y}px`
}

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
// 初始缩放比例
let scale = 1
// 绘制原始图像
ctx.fillStyle = 'red'
ctx.fillRect(50, 25, 10, 10)
 
function drawImage (clientX, clientY) {
    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    // 清除之前的放大图像
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 绘制原始图像
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height)
    // 设置放大倍数
    scale = 2
    // 计算放大后的坐标
    const scaledWidth = canvas.width * scale
    const scaledHeight = canvas.height * scale
    const startX = x - (scaledWidth / 2)
    const startY = y - (scaledHeight / 2)
    // 绘制放大后的图像
    ctx.drawImage(canvas, startX, startY, scaledWidth, scaledHeight, 0, 0, canvas.width * scale, canvas.height * scale)

    targetCricle.appendChild(canvas)
}

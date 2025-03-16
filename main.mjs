import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import data from "./data.json" with { type: "json" };

// Specify the chart’s dimensions, based on a bar’s height.
const barHeight = 42;
const marginTop = 30;
const marginRight = 0;
const marginBottom = 40;
const marginLeft = 80;
const width = Math.min(500, window.innerWidth - 64); // màn hình dưới 500px sẽ lấy theo kích thước window trừ đi khoảng cáchh 2 bên 
const radius = 0;
const height = Math.ceil((data.length + 0.1) * barHeight) + marginTop + marginBottom;

// Qui định trục ngang dọc
const x = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.frequency)])
  .range([marginLeft, width - marginRight]);

const y = d3.scaleBand()
  .domain(data.map(d => d.letter))
  .rangeRound([marginTop, height - marginBottom])
  .padding(0.3);

const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style",
    `
        max-width: 100%;
        height: auto;
        font: 10px sans-serif;
        padding: 4px 16px;
        `);
const colors = ["#2f75bb", "#882490", "#00a74f", "#bcbdbf"];

// Tạo các thanh với màu sắc khác nhau
svg.append("g")
  .selectAll()
  .data(data)
  .join("rect")
  .attr("fill", (d, i) => colors[i % colors.length])
  .attr("x", x(0))
  .attr("y", (d) => y(d.letter))
  .attr("width", (d) => x(d.frequency) - x(0))
  .attr("height", y.bandwidth())
  .attr("rx", radius);

// Hiển thị con số của mỗi thanh
svg.append("g")
  .attr("fill", "#fff")
  .attr("text-anchor", "start")
  .selectAll()
  .data(data)
  .join("text")
  .attr("x", x(0)) // Đặt vị trí văn bản ở sát x(0) bên trái
  .attr("y", (d) => y(d.letter) + y.bandwidth() / 2)
  .attr("dx", +8) // Khoảng cách từ thân thanh
  .attr("dy", "0.35em")
  .text((d) => `${d.frequency}%`)
  // condition: nếu giá trị nhỏ đẩy nó sang phải bằng dx và text-anchor
  .call((text) => text.filter(d => d.frequency < 10) // short bars
    .attr("x", d => x(d.frequency) + 4)
    .attr("dx", 0)
    .attr("fill", "#3c3c43")
    .attr("text-anchor", "start"));

// Thêm trục x vào svg
const formatXTick = d => d3.format("~s")(d)
svg.append("g")
  .attr("transform", `translate(0,${marginTop})`)
  .call(
    d3.axisTop(x)
      .ticks(d3.max(data, d => d.frequency) / 10) // Đặt ticks cách nhau 10 đơn vị
      .tickFormat(formatXTick)
  )
  .call(g => g.selectAll(".tick line").attr("stroke", "#c1c0c3")) // Đổi màu cho đường tick của trục x
  .call(g => g.select(".domain").attr("stroke", "#c1c0c3"));

// Thêm trục y vào svg
svg.append("g")
  .attr("transform", `translate(${marginLeft},0)`)
  .call(d3.axisLeft(y).tickSizeOuter(0))
  .call(g => g.selectAll(".tick line").attr("stroke", "none"))
  .call(g => g.selectAll(".tick text").attr("fill", "#000"))
  .call(g => g.select(".domain").attr("stroke", "#c1c0c3"));

// Thêm các đường kẻ dọc theo trục x (grid lines)
svg.append("g")
  .attr("class", "grid")
  .attr("transform", `translate(0,${marginTop})`) // Đặt cùng vị trí với trục x
  .call(
    d3.axisTop(x)
      .ticks(d3.max(data, d => d.frequency) / 10) // Các tick tại 10, 20, 30,...
      .tickSize(-height + marginTop + marginBottom) // Kéo dài grid lines xuống dưới
      .tickFormat("") // Không hiển thị text của tick
  )
  .call(g => g.selectAll(".tick line").attr("stroke", "#c1c0c3").attr("stroke-width", 0.7)) // Đặt màu cho đường grid
  .call(g => g.select(".domain").remove());

chart.append(svg.node());

content.innerHTML = `
  This graph illustrates how UK pet owners felt about their choice of pet during 2019. It's clear that people who owned just dogs were considerably happier
  than others about that decision, with 36% saying they were very happy.
  This was closely followed by 28% of pet owners that had both a dog and a cat. Interestingly, it seems that having no pet at all almost brings the same amount of joy as having a dog, while
  owners of only cats were almost half as happy as owners.
`;
const link = document.createElement('a')
link.textContent = "You can click here for other source"
link.setAttribute("href", "https://www.thefacultylounge.org/2019/04/two-recent-articles-have-attempted-to-quantify-the-difference-between-cat-people-and-dog-people-using-different-data-sets-an.html")
link.setAttribute("target", "_blank")
link.setAttribute("ref", "noopener noreferrer")
content.appendChild(link)


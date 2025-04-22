import * as d3 from 'd3'
import type { Objective } from '../types/objective'
import { getGradeColor } from '../services/color'
import { getTitle } from '../services/string'
import { buildGradeFromObjectiveReference } from '../services/reference'
import type { UnitObjective } from '../types/unit'

export function isKey (objective: Objective | UnitObjective): boolean {
  return objective.descendantsCount > 3
}

export function appendPrerequisiteTree (container: HTMLElement, objective: Objective): void {
  const width = Math.min(Math.floor(container.clientWidth / 2), 600)
  const height = width * 0.9
  const divAncestors = document.createElement('div')
  const divDescendants = document.createElement('div')
  divAncestors.className = 'w-1/2 flex justify-end'
  divDescendants.className = 'w-1/2'
  appendTree(divAncestors, objective, 'ancestors', width, height, container)
  appendTree(divDescendants, objective, 'descendants', width, height, container)
  const wrapper = document.createElement('div')
  wrapper.className = 'flex flex-row'
  wrapper.appendChild(divAncestors)
  wrapper.appendChild(divDescendants)
  container.appendChild(wrapper)
}

function appendTree (container: HTMLElement, rootNode: Objective, type: 'ancestors' | 'descendants', width: number, height: number, parentContainer: HTMLElement): void {
  const widthPadding = 130 // to avoid the text being cut off
  const heightPadding = 100 // to avoid the text being cut off
  const accessorFunction = type === 'ancestors' ? (d: any) => d.ancestors : (d: any) => d.descendants
  const linkColor = type === 'ancestors' ? '#8B4513' : '#E48900'
  const nodeColor = type === 'ancestors' ? '#A0522D' : '#E48900'

  // Create a new SVG element for this tree
  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink') // Add xlink namespace

  const root = d3.hierarchy(rootNode, accessorFunction)

  const treeLayout = d3.tree<Objective>().size([height - heightPadding, width - widthPadding])
  treeLayout(root)

  // Calculate the vertical offset to center the tree
  const rootY = root.x // The `x` position of the root node
  const verticalOffset = height / 2 - (rootY ?? 0)

  // Create links
  const links = root.links()
  const linkGenerator = d3.linkHorizontal<d3.HierarchyLink<Objective>, d3.HierarchyNode<Objective>>()
    .x((d) => (type === 'ancestors' ? width - (d.y ?? 0) : (d.y ?? 0)))
    .y((d) => d.x ?? 0)

  const treeGroup = svg
    .append('g')
    .attr('transform', `translate(${type === 'ancestors' ? '-45' : '2.5'}, ${verticalOffset})`) // horizontal offset are set to elegantly meld the two trees

  treeGroup
    .selectAll('path')
    .data(links)
    .enter()
    .append('path')
    .attr('d', linkGenerator)
    .attr('fill', 'none')
    .attr('stroke', linkColor)
    .attr('stroke-width', 2)
    .attr('stroke-opacity', 0.3)

  // Create nodes
  const nodes = root.descendants()
  const nodeGroup = treeGroup
    .selectAll<SVGGElement, d3.HierarchyNode<Objective>>('g')
    .data(nodes)
    .enter()
    .append('g')
    .attr('transform', (d: d3.HierarchyNode<Objective>) => `translate(${type === 'ancestors' ? width - (d.y ?? 0) : d.y},${d.x})`)

  nodeGroup
    .append('path')
    .attr('d', d3.symbol().type(d3.symbolTriangle).size(50)) // Use triangle shapes
    .attr('fill', nodeColor) // Use sepia or green for nodes
    .attr('transform', 'rotate(90)')

  if (type === 'descendants' && nodes.length === 1) {
    return // to avoid having the label of the root node being displayed twice
  }
  // Append text to nodes
  nodeGroup
    .append('a')
    .attr('xlink:href', (d) => `?v=objective&ref=${d.data.reference}`)
    .attr('target', '_blank')
    .each(function (d: d3.HierarchyNode<Objective>) {
      if (!(this.parentNode instanceof SVGGElement)) {
        throw new Error('Parent node is not an SVG element')
      }
      const group = d3.select<SVGGElement, d3.HierarchyNode<Objective>>(this.parentNode)

      // Append a rectangle behind the text
      group
        .select('a')
        .append('rect')
        .attr('x', (d: d3.HierarchyNode<Objective>) => ((d.children && type === 'ancestors') || (!d.children && (type === 'descendants' || nodes.length === 1)) ? 6 : -41))
        .attr('y', -10)
        .attr('width', 38)
        .attr('height', 20)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('fill', 'white')
        .attr('stroke', (d) => getGradeColor(`${d.data.reference.slice(0, 1)}e`))
        .attr('stroke-width', 1)
        .style('pointer-events', 'none')

      const tooltip = d3
        .select(container)
        .append('div')
        .style('position', 'fixed')
        .style('background', 'white')
        .style('border', '1px solid #ccc')
        .style('border-radius', '5px')
        .style('padding', '5px')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('visibility', 'hidden')
      // Append the text
      group
        .select('a')
        .append('text')
        .attr('dy', 5)
        .attr('x', (d) => ((d.children && type === 'ancestors') || (!d.children && (type === 'descendants' || nodes.length === 1)) ? 8 : -5))
        .style('text-anchor', (d) => ((d.children && type === 'ancestors') || (!d.children && (type === 'descendants' || nodes.length === 1)) ? 'start' : 'end'))
        .style('font-size', '14px')
        .style('fill', (d) => getGradeColor(buildGradeFromObjectiveReference(d.data.reference)))
        .text((d) => d.data.reference)
        .on('mouseover', (event: MouseEvent, d) => {
          tooltip
            .style('visibility', 'visible')
            .style('color', getGradeColor(buildGradeFromObjectiveReference(d.data.reference)))
            .style('border', `1px solid ${getGradeColor(buildGradeFromObjectiveReference(d.data.reference))}`)
            .text(getTitle(d.data))
        })
        .on('mousemove', (event: MouseEvent) => {
          tooltip
            .style('top', `${event.screenY - 108}px`)
            .style('left', `${event.screenX + 8}px`)
        })
        .on('mouseout', () => {
          tooltip.style('visibility', 'hidden')
        })
    })
}

import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const KnowledgeGraph = () => {
  const svgRef = useRef();
  const [showPopup, setShowPopup] = useState(false); // State to show/hide popup
  const [popupContent, setPopupContent] = useState(""); // State to store the LaTeX content

  useEffect(() => {
    const width = 960;
    const height = 500;

    const nodes = [
      {
        id: 1,
        name: "Matrici",
        group: "matrici",
        color: "#45CACB",
        latex: `Definiția unei matrice
O matrice este un tabel dreptunghiular de numere, aranjate pe linii și coloane. Se notează de obicei cu litere mari, cum ar fi \\( A \\), și are dimensiunea \\( m \\times n \\), unde \\( m \\) reprezintă numărul de linii și \\( n \\) numărul de coloane.

Exemplu de matrice \\( A \\) de dimensiune \\( 2 \\times 3 \\):
\\[
A = \\begin{pmatrix} 
1 & 2 & 3 \\\\
4 & 5 & 6 
\\end{pmatrix}
\\]
Aici, avem două linii și trei coloane.`,
      },
      {
        id: 2,
        name: "Integrale",
        group: "integrale",
        color: "#508BA9",
        latex: `
Definiția unei integrale
O integrală este o operație matematică folosită pentru a calcula aria de sub o curbă sau pentru a găsi cantitatea totală acumulată într-un anumit interval.

      Integrala definită: calculează aria de sub graficul unei funcții între două puncte \\(a\\) și \\(b\\).
      Integrala nedefinită: reprezintă o familie de funcții primitive pentru o funcție dată, fiind notată cu \\( \\int f(x) dx \\).
 
        `,
      },
      {
        id: 3,
        name: "Determinantul unei matrice pătrate",
        group: "matrici",
        color: "#45CACB",
        latex: `Determinantul unei matrice pătrate
Determinantul este o valoare scalară asociată unei matrice pătrate și este folosit pentru a determina dacă matricea are inversă (dacă determinantul este diferit de 0, matricea are inversă). De exemplu, pentru o matrice de ordin \\( 2 \\times 2 \\):
\\[
\\text{Determinant} = \\text{det}(A) = \\begin{vmatrix} 
a & b \\\\ 
c & d 
\\end{vmatrix} = ad - bc
\\]`,
      },
      {
        id: 4,
        name: "Operații cu matrice",
        group: "matrici",
        color: "#45CACB",
        latex: `Operații cu matrice

    Adunarea și scăderea: Se adună sau se scad elementele corespunzătoare de pe aceleași poziții (linii și coloane trebuie să aibă aceeași dimensiune).
    Înmulțirea cu un scalar: Fiecare element al matricei se înmulțește cu numărul scalar dat.
    Înmulțirea matricilor: Acest proces este mai complicat și trebuie să îți amintești regula: elementul de pe poziția \\( (i,j) \\) din produs se obține înmulțind elementele corespunzătoare din linia \\( i \\) a primei matrice cu elementele din coloana \\( j \\) a celei de-a doua matrice și apoi adunând aceste produse.
`,
      },
      {
        id: 5,
        name: "Notarea integralelor",
        group: "integrale",
        color: "#508BA9",
        latex: `
Notarea integralelor
}
      Integrală nedefinită}: \\( \\int f(x) dx \\)
  
         Aceasta reprezintă funcția primitivă (antiderivata) lui \\( f(x) \\), plus o constantă \\( C \\).
        Ex: \\( \\int x^2 dx = \\frac{x^3}{3} + C \\)
     
      Integrală definită}: \\( \\int_a^b f(x) dx \\)

       Aceasta calculează aria sub graficul funcției între \\( x = a \\) și \\( x = b \\).
        Formula este: \\( \\int_a^b f(x) dx = F(b) - F(a) \\)
 unde \\( F(x) \\) este primitiva lui \\( f(x) \\).
     
        `,
      },
      {
        id: 6,
        name: "Tipuri importante de funcții la Bac",
        group: "integrale",
        color: "#508BA9",
        latex: `
Tipuri importante de funcții care apar la Bac
La Bacalaureat, integralele sunt asociate cu funcții de bază. Trebuie să cunoști formulele de integrare pentru:

      Funcții polinomiale: \\( \\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\) (pentru \\( n \\neq -1 \\))

Ex: \\( \\int x^2 dx = \\frac{x^3}{3} + C \\)
     
      Funcția exponențială: \\( \\int e^x dx = e^x + C \\)
      Funcția trigonometrică:

         \\( \\int \\sin(x) dx = - \\cos(x) + C \\)
        \\( \\int \\cos(x) dx = \\sin(x) + C \\)
     
      Funcția de formă \\( \\frac{1}{x} \\): \\( \\int \\frac{1}{x} dx = \\ln |x| + C \\)

        `,
      },
      {
        id: 7,
        name: "Tehnici de integrare",
        group: "integrale",
        color: "#508BA9",
        latex: `
Tehnici de integrare
Există câteva tehnici pe care le poți întâlni la Bacalaureat:

Integrarea prin părți: Folosită pentru funcțiile produse de două alte funcții, este echivalentul formulei derivării produsului. Formula este:
    \\[
    \\int u(x) v'(x) dx = u(x) v(x) - \\int u'(x) v(x) dx
    \\]
    Ex: pentru funcții de tip \\( x \\cdot e^x \\).
Schimbarea de variabilă (substituție): Aceasta este utilă atunci când funcția din integrand se poate simplifica printr-o schimbare de variabilă. De exemplu, dacă avem de integrat \\( f(g(x)) \\cdot g'(x) \\), facem substituția \\( u = g(x) \\) pentru a simplifica calculul.

        `,
      },
      {
        id: 8,
        name: "Calculul integralelor definite",
        group: "integrale",
        color: "#508BA9",
        latex: `
Calculul integralelor definite
Pentru integralele definite, cum am menționat mai devreme, folosim primitiva funcției și aplicăm limita superioară și inferioară a intervalului. Exemplu:
\\[
\\int_1^3 x^2 dx
\\]
Calculăm mai întâi primitiva lui \\( x^2 \\), care este \\( \\frac{x^3}{3} \\). Apoi evaluăm:
\\[
\\left[ \\frac{x^3}{3} \\right]_1^3 = \\frac{3^3}{3} - \\frac{1^3}{3} = \\frac{27}{3} - \\frac{1}{3} = \\frac{26}{3}
\\]
        `,
      },
      {
        id: 9,
        name: "Aplicații la Bac",
        group: "integrale",
        color: "#508BA9",
        latex: `
Aplicații importante la Bacalaureat
La examenul de Bac, integralele apar atât pentru calcule directe, cât și în probleme de aplicație, cum ar fi:

Calculul ariei între două funcții. Trebuie să știi cum să calculezi diferența dintre funcții pentru a determina aria dintre curbe.
Volumul de rotație: În unele cazuri, integrala este folosită pentru a calcula volumul unui corp generat prin rotirea unei curbe în jurul axelor.

Exemplu simplu de calcul al ariei:
\\[
A = \\int_{a}^{b} \\left| f(x) - g(x) \\right| dx
\\]
unde \\( f(x) \\) și \\( g(x) \\) sunt funcțiile între care se află aria respectivă.
        `,
      },
    ];

    const links = [
      { source: 1, target: 3 },
      { source: 1, target: 4 },
      { source: 2, target: 5 },
      { source: 2, target: 6 },
      { source: 2, target: 7 },
      { source: 2, target: 8 },
      { source: 2, target: 9 },
      { source: 1, target: 2 }, // Connection between Matrici and Integrale
    ];

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(200)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5);

    const node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 19)
      .attr("fill", (d) => d.color)
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(0)
          .attr("r", 24)
          .attr("fill", "#FFD700");

        // Change the color of the corresponding label
        d3.select(`#label-${d.id}`)
          .transition()
          .duration(0)
          .attr("fill", "#ffffff");
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("r", 19)
          .attr("fill", d.color);

        // Revert the label color
        d3.select(`#label-${d.id}`)
          .transition()
          .duration(200)
          .attr("fill", d.group === "matrici" ? "#508BA9" : "#45CACB");
      })
      .on("click", (event, d) => {
        setPopupContent(d.latex);
        setShowPopup(true);

        setTimeout(() => {
          if (window.MathJax && window.MathJax.Hub) {
            window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
          }
        }, 0);
      })
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    const label = svg
      .append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("id", (d) => `label-${d.id}`)
      .attr("class", "label text-xl")
      .text((d) => d.name)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + 30) // Offset label 30px below the node
      .attr("text-anchor", "middle")
      .attr("fill", (d) => (d.group === "matrici" ? "#508BA9" : "#45CACB"));

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      label.attr("x", (d) => d.x).attr("y", (d) => d.y + 50);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, []);

  return (
    <div className="w-full overflow-hidden relative">
      {/* D3 SVG */}
      <svg ref={svgRef}></svg>

      {/* Popup */}
      {showPopup && (
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 p-5 bg-gunmetal-blue border-4 border-princeton-orange rounded-lg shadow-lg z-50 w-full text-center overflow-y-auto h-full ">
          <span
            className="absolute top-2.5 right-3.5 cursor-pointer text-xl font-bold"
            onClick={() => setShowPopup(false)}
          >
            &times;
          </span>
          <div
            className="text-princeton-orange"
            dangerouslySetInnerHTML={{ __html: popupContent }}
          />{" "}
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraph;

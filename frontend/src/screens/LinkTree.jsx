import { LucideLink } from "lucide-react";
import React from "react";
import { Link } from "react-router";

export default function LinkTree() {
  return (
    <div>
      <h2 className="centrado">ADMINISTRADOR DEMODA</h2>
      <h3 className="centrado font-x">Links Directo a Aplicaciones</h3>

      <div className="linktree-container">
        <span className="span-route">
          <label>Tablas Dinamicas Consolidadas</label>
          <div className="link-container">
            <LucideLink />
            <Link to="/consolidadoventas">
              <p className="span-admin-consolidado">Ventas Consolidadas (analitics)</p>
            </Link>
          </div>
          <div className="link-container">
            <LucideLink />
            <Link to="/consolidadoarticulos">
              <p className="span-admin-consolidado">Ventas por Articulos (analitics)</p>
            </Link>
          </div>
        </span>
      </div>

      <div className="linktree-container">
        <span className="span-route">
          <label>Front-End (ventas al detal)</label>

          <div className="link-container">
            <LucideLink />
            <a
              href="https://front-chacao-ems84m3vx-tyrant7995gmailcoms-projects.vercel.app/"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {" "}
              <p>Front-End Tienda Chacao</p>
            </a>
          </div>
          <div className="link-container">
            <LucideLink />
            <a
              href="https://front-merpoeste-di4orofvq-tyrant7995gmailcoms-projects.vercel.app/"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {" "}
              <p>Front-End Tienda Merpoeste</p>
            </a>
          </div>
          <div className="link-container">
            <LucideLink />
            <a
              href="https://planner-b4ey3we1w-tyrant7995gmailcoms-projects.vercel.app/"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {" "}
              <p>Planificador Tienda Chacao</p>
            </a>
          </div>
          <div className="link-container">
            <LucideLink />
            <a
              href="https://horario-p9wma9x58-franklin-bolivars-projects.vercel.app/"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {" "}
              <p>Horarios Tienda Chacao</p>
            </a>
          </div>
        </span>
      </div>

      <div className="linktree-container">
        <span className="span-route">
          <label>Control de Gastos</label>
          <div className="link-container">
            <LucideLink />
            <a
              href="https://a-vite-project-q2dooo892-skynetfrank.vercel.app/"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {" "}
              <p>Control de Gastos Los Frailes</p>
            </a>
          </div>
          <div className="link-container">
            <LucideLink />
            <a
              href="https://gastos-chacao2app-r0fuei42i-franklin-bolivars-projects.vercel.app/"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {" "}
              <p>Control de Gastos Chacao </p>
            </a>
          </div>
        </span>
      </div>

      <div className="linktree-container">
        <span className="span-route">
          <label>Otros</label>
          <div className="link-container">
            <LucideLink />
            <a
              href="https://intranet-v2-9drcsb58h-tyrant7995gmailcoms-projects.vercel.app/"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {" "}
              <p>Chat Intranet Demoda</p>
            </a>
          </div>
          <div className="link-container">
            <LucideLink />
            <a
              href="https://admin-reseller-2vba5qtd7-franklin-bolivars-projects.vercel.app/"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {" "}
              <p>Administrador de Revendedores</p>
            </a>
          </div>
          <div className="link-container">
            <LucideLink />
            <a
              href="https://preorder-atn4pwqy4-skynetfrank.vercel.app/"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {" "}
              <p>Administrador de Preorden </p>
            </a>
          </div>
        </span>
      </div>

      <div className="linktree-container">
        <span className="span-route pd">
          <label>Plaza Dental</label>
          <div className="link-container pd">
            <LucideLink />
            <a
              href="https://plazadental-v2-j2g1jnntr-tyrant7995gmailcoms-projects.vercel.app/"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {" "}
              <p>Plaza Dental 2025 (nuevo)</p>
            </a>
          </div>

          <div className="link-container pd">
            <LucideLink />
            <a
              href="https://plaza-dental-ihm65vu3k-franklin-bolivars-projects.vercel.app/"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {" "}
              <p>Plaza Dental (Antiguo)</p>
            </a>
          </div>
          <div className="link-container pd">
            <LucideLink />
            <a
              href="https://plaza-stock-cpbxmd5c6-franklin-bolivars-projects.vercel.app/"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {" "}
              <p>Inventario Plaza Dental</p>
            </a>
          </div>
          <div className="link-container pd">
            <LucideLink />
            <a
              href="https://planner-plaza-9tp7wnvii-tyrant7995gmailcoms-projects.vercel.app/"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {" "}
              <p>Planificador Plaza Dental</p>
            </a>
          </div>
        </span>
      </div>
    </div>
  );
}

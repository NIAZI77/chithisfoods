import{bC as p,d as u,n as g,u as d,bD as f,j as e,bE as m,I as h,bh as b,aV as x,U as i,a$ as M,b0 as j,bF as C,bG as y}from"./strapi-B0YwOZlt.js";import{u as k}from"./useAdminRoles-H1TFksyF-M1EReqO7.js";const v=({children:a,target:t})=>{const{toggleNotification:n}=g(),{formatMessage:o}=d(),{copy:r}=f(),l=o({id:"app.component.CopyToClipboard.label",defaultMessage:"Copy to clipboard"}),c=async s=>{s.preventDefault(),await r(t)&&n({type:"info",message:o({id:"notification.link-copied"})})};return e.jsx(m,{endAction:e.jsx(h,{label:l,variant:"ghost",onClick:c,children:e.jsx(b,{})}),title:t,titleEllipsis:!0,subtitle:a,icon:e.jsx("span",{style:{fontSize:32},children:"✉️"}),iconBackground:"neutral100"})},E=({registrationToken:a})=>{const{formatMessage:t}=d(),n=`${window.location.origin}${y()}/auth/register?registrationToken=${a}`;return e.jsx(v,{target:n,children:t({id:"app.components.Users.MagicLink.connect",defaultMessage:"Copy and share this link to give access to this user"})})},F=({disabled:a})=>{const{isLoading:t,roles:n}=k(),{formatMessage:o}=d(),{value:r=[],onChange:l,error:c}=x("roles");return e.jsxs(i.Root,{error:c,hint:o({id:"app.components.Users.ModalCreateBody.block-title.roles.description",defaultMessage:"A user can have one or several roles"}),name:"roles",required:!0,children:[e.jsx(i.Label,{children:o({id:"app.components.Users.ModalCreateBody.block-title.roles",defaultMessage:"User's roles"})}),e.jsx(M,{disabled:a,onChange:s=>{l("roles",s)},placeholder:o({id:"app.components.Select.placeholder",defaultMessage:"Select"}),startIcon:t?e.jsx($,{}):void 0,value:r.map(s=>s.toString()),withTags:!0,children:n.map(s=>e.jsx(j,{value:s.id.toString(),children:o({id:`global.${s.code}`,defaultMessage:s.name})},s.id))}),e.jsx(i.Error,{}),e.jsx(i.Hint,{})]})},L=p`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
`,S=u.div`
  animation: ${L} 2s infinite linear;
`,$=()=>e.jsx(S,{children:e.jsx(C,{})});export{E as M,F as S,v as a};

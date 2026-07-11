import numpy as np, heapq, json
from PIL import Image
from scipy import ndimage

im = Image.open('proj/森芯島原始檔/src/assets/map.webp').convert('RGB')
W,H = im.size
a = np.asarray(im).astype(int); R,G,B = a[:,:,0],a[:,:,1],a[:,:,2]
land = np.load('land.npy'); dist = np.load('dist.npy')

# tighter road mask (bright warm cream paths)
road = (R-B>55)&(R>200)&(G>178)&(B<170)&land
road = ndimage.binary_closing(road, np.ones((7,7)))
roadprox = ndimage.distance_transform_edt(~road)
print("road frac of land:", round(float(road.sum()/land.sum()),3))

NODES = {
  "dock":     (28, 79),
  "fountain": (47, 62),
  "manor":    (58, 56),
  "cliffhut": (82, 27),
  "park":     (48, 12),
}

def snap(px,py,minsea=14):
    x0,y0 = int(px/100*W), int(py/100*H)
    ok = land & (dist>=minsea)
    ys,xs = np.nonzero(ok)
    d = (xs-x0)**2 + (ys-y0)**2
    i = int(np.argmin(d))
    return int(xs[i]), int(ys[i]), float(np.sqrt(d[i]))

snapped={}
for k,(px,py) in NODES.items():
    x,y,mv = snap(px,py)
    snapped[k]=(x,y)
    print(f"{k:9s} asked({px},{py}) -> px({x},{y}) moved {mv:.0f}px  seaDist={dist[y,x]:.0f}")

# ---- A* on a coarse grid ----
S = 3  # grid step px
gh, gw = H//S, W//S
gland = land[::S,::S][:gh,:gw]
gdist = dist[::S,::S][:gh,:gw]
groad = roadprox[::S,::S][:gh,:gw]

def cost(gy,gx):
    if not gland[gy,gx]: return None
    c = 1.0
    c += 26.0/ (gdist[gy,gx] + 4.0)      # push away from the sea
    c += min(groad[gy,gx],90)/6.0          # strongly prefer roads
    return c

NB=[(-1,0),(1,0),(0,-1),(0,1),(-1,-1),(-1,1),(1,-1),(1,1)]
def astar(s,t):
    sy,sx = s[1]//S, s[0]//S
    ty,tx = t[1]//S, t[0]//S
    def h(y,x): return (abs(y-ty)+abs(x-tx))*1.0
    open_=[(0,0,(sy,sx))]; g={(sy,sx):0}; par={}
    seen=set()
    while open_:
        f,gc,cur = heapq.heappop(open_)
        if cur in seen: continue
        seen.add(cur)
        if cur==(ty,tx): break
        cy,cx=cur
        for dy,dx in NB:
            ny,nx=cy+dy,cx+dx
            if not (0<=ny<gh and 0<=nx<gw): continue
            c = cost(ny,nx)
            if c is None: continue
            step = c*(1.414 if dy and dx else 1.0)
            ng = gc+step
            if ng < g.get((ny,nx), 1e18):
                g[(ny,nx)]=ng; par[(ny,nx)]=cur
                heapq.heappush(open_,(ng+h(ny,nx),ng,(ny,nx)))
    if (ty,tx) not in par and (ty,tx)!=(sy,sx): return None
    path=[(ty,tx)]
    while path[-1]!=(sy,sx): path.append(par[path[-1]])
    path.reverse()
    return [(x*S, y*S) for y,x in path]

def simplify(pts, tol=6):
    # Ramer-Douglas-Peucker
    if len(pts)<3: return pts
    import math
    def rdp(p):
        if len(p)<3: return p
        x0,y0=p[0]; x1,y1=p[-1]
        dx,dy=x1-x0,y1-y0; L=math.hypot(dx,dy) or 1
        best=0; bi=0
        for i in range(1,len(p)-1):
            x,y=p[i]
            d=abs(dy*x-dx*y+x1*y0-y1*x0)/L
            if d>best: best,bi=d,i
        if best>tol:
            return rdp(p[:bi+1])[:-1]+rdp(p[bi:])
        return [p[0],p[-1]]
    return rdp(pts)

keys=list(NODES)
out={}
bad=0
for i in range(len(keys)):
    for j in range(i+1,len(keys)):
        A,Bk=keys[i],keys[j]
        p=astar(snapped[A],snapped[Bk])
        if not p: print("NO PATH",A,Bk); bad+=1; continue
        # verify every pixel along the polyline is land
        chk=[]
        for k in range(len(p)-1):
            (x1,y1),(x2,y2)=p[k],p[k+1]
            n=int(max(abs(x2-x1),abs(y2-y1)))+1
            for t in range(n+1):
                x=int(x1+(x2-x1)*t/n); y=int(y1+(y2-y1)*t/n)
                chk.append(land[min(y,H-1),min(x,W-1)])
        sp=simplify(p, tol=2.5)
        # re-verify simplified
        ok2=True; mind=999
        for k in range(len(sp)-1):
            (x1,y1),(x2,y2)=sp[k],sp[k+1]
            n=int(max(abs(x2-x1),abs(y2-y1)))+1
            for t in range(n+1):
                x=int(x1+(x2-x1)*t/n); y=int(y1+(y2-y1)*t/n)
                if not land[min(y,H-1),min(x,W-1)]: ok2=False
                mind=min(mind, dist[min(y,H-1),min(x,W-1)])
        out[A+"-"+Bk]={"raw":all(chk),"simpl_ok":ok2,"minSeaDist":round(float(mind),1),
                       "pts":[[round(x/W*100,2), round(y/H*100,2)] for x,y in sp]}
        print(f"{A:9s}->{Bk:9s} rawOnLand={all(chk)} simplOnLand={ok2} minSeaDist={mind:.0f}px pts={len(sp)}")

json.dump({"nodes":{k:[round(v[0]/W*100,2),round(v[1]/H*100,2)] for k,v in snapped.items()},
           "paths":{k:v["pts"] for k,v in out.items()}}, open("mappaths.json","w"), ensure_ascii=False, indent=1)
print("\npairs:",len(out),"bad:",bad)

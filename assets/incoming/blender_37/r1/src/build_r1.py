"""Art37 R1. Run with Blender --background --python build_r1.py -- OUTPUT_DIR.
All visible art is modeled and shaded in Blender; no downloaded/generated images.
"""
import bpy, math, random, sys, json
from pathlib import Path
from mathutils import Vector
from math import sin, cos, pi, exp
OUT=Path(sys.argv[sys.argv.index('--')+1]).resolve()
RAW=OUT/'raw'; RAW.mkdir(parents=True,exist_ok=True)
(OUT/'src').mkdir(exist_ok=True)
random.seed(3701)
bpy.ops.wm.read_factory_settings(use_empty=True)
s=bpy.context.scene; s.name='Art37 R1 — Sour Ant Nest'
s.render.film_transparent=True
noInk=bpy.data.collections.new('No outline • contact shadows and fine details');s.collection.children.link(noInk)
try: s.render.engine='BLENDER_EEVEE'
except TypeError as e: raise RuntimeError(str(e))
s.view_settings.view_transform='Standard'
s.view_settings.look='None'
s.view_settings.exposure=0; s.view_settings.gamma=1
s.render.image_settings.file_format='PNG'; s.render.image_settings.color_mode='RGBA'
s.render.film_transparent=True
s.render.resolution_percentage=100
s.world=bpy.data.worlds.new('Warm ambient'); s.world.use_nodes=True
next(n for n in s.world.node_tree.nodes if n.type=='BACKGROUND').inputs['Color'].default_value=(.22,.19,.14,1)
next(n for n in s.world.node_tree.nodes if n.type=='BACKGROUND').inputs['Strength'].default_value=.35
def lin(v):
    return v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4
def rgb(h): return tuple(lin(int(h[i:i+2],16)/255) for i in (0,2,4))+(1,)
def mat(name,h,shade=True):
    m=bpy.data.materials.new(name); m.use_nodes=True
    n=m.node_tree.nodes; n.clear(); l=m.node_tree.links
    out=n.new('ShaderNodeOutputMaterial'); em=n.new('ShaderNodeEmission')
    if shade:
        d=n.new('ShaderNodeBsdfDiffuse'); d.inputs['Color'].default_value=(.8,.8,.8,1)
        t=n.new('ShaderNodeShaderToRGB'); ramp=n.new('ShaderNodeValToRGB')
        ramp.color_ramp.interpolation='EASE'
        c=rgb(h); a=ramp.color_ramp.elements[0]; a.position=.12; a.color=tuple(v*.56 for v in c[:3])+(1,)
        b=ramp.color_ramp.elements[1]; b.position=.82; b.color=c
        mid=ramp.color_ramp.elements.new(.47); mid.color=tuple(v*.8 for v in c[:3])+(1,)
        l.new(d.outputs[0],t.inputs[0]); l.new(t.outputs[0],ramp.inputs[0]); l.new(ramp.outputs[0],em.inputs[0])
    else: em.inputs[0].default_value=rgb(h)
    l.new(em.outputs[0],out.inputs[0]); m.diffuse_color=rgb(h)
    return m
earth=mat('Earth • cocoa warm','82705a'); earthDark=mat('Earth crevices','554432')
earthLight=mat('Earth rolled rim','9a805c'); dark=mat('Outline • warm umber','33271d',False)
seed=mat('Seed shell • toasted caramel','9d7549'); inner=mat('Seed shell • interior','b99b6d')
crumb=mat('Cracker • baked edge','ab8550'); crumbTop=mat('Cracker • golden crumb','bc9a64')
leaf=mat('Leaf • dry ochre','a08048'); vein=mat('Leaf veins','635038')
acid=mat('Acid • muted apple green','75a947'); acidHi=mat('Acid • candy highlight','a4cd6c',False)
acidDark=mat('Acid • deep olive rim','3e6428'); stone=mat('Pebble • warm gray','8c8271')
hole=mat('Ant hole • deep cocoa','30251c',False)
def mesh(name,vs,fs,m):
    me=bpy.data.meshes.new(name); me.from_pydata(vs,[],fs); me.update()
    o=bpy.data.objects.new(name,me); s.collection.objects.link(o); o.data.materials.append(m); return o
def uv(name,loc,scale,m,seg=24,rings=12):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg,ring_count=rings,location=loc)
    o=bpy.context.object; o.name=name; o.scale=scale; o.data.materials.append(m)
    for p in o.data.polygons:p.use_smooth=True
    return o
def ico(name,loc,scale,m,sub=2):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub,radius=1,location=loc)
    o=bpy.context.object; o.name=name; o.scale=scale; o.data.materials.append(m); return o
def line(name,pts,r,m):
    c=bpy.data.curves.new(name,'CURVE'); c.dimensions='3D'; c.bevel_depth=r; c.bevel_resolution=2
    sp=c.splines.new('POLY'); sp.points.add(len(pts)-1)
    for p,v in zip(sp.points,pts):p.co=(*v,1)
    o=bpy.data.objects.new(name,c); s.collection.objects.link(o); noInk.objects.link(o); o.data.materials.append(m); return o
def rim(name,rx,ry,z,t,m):
    return line(name,[(rx*cos(i*2*pi/96),ry*sin(i*2*pi/96),z+.022*sin(i*6*pi/96)) for i in range(97)],t,m)
def crystal(name,x,y,z,r,h,m):
    vs=[(x+r*cos(i*pi/3),y+r*sin(i*pi/3),z) for i in range(6)]
    vs += [(x+r*.84*cos(i*pi/3),y+r*.84*sin(i*pi/3),z+h*.68) for i in range(6)]
    vs += [(x+r*.24,y+r*.1,z+h)]
    fs=[tuple(reversed(range(6)))]+[(i,(i+1)%6,(i+1)%6+6,i+6) for i in range(6)]+[(i+6,(i+1)%6+6,12) for i in range(6)]
    return mesh(name,vs,fs,m)
def lighting():
    l=bpy.data.lights.new('Sun • upper left • elevation 60deg','SUN'); l.energy=2.1; l.angle=math.radians(24)
    o=bpy.data.objects.new(l.name,l); s.collection.objects.link(o)
    o.location=(-4,-6,12); direction=Vector((.353553,.353553,-.866025)); o.rotation_euler=direction.to_track_quat('-Z','Y').to_euler()
lighting()
cam=bpy.data.cameras.new('Shared orthographic'); camera=bpy.data.objects.new(cam.name,cam); s.collection.objects.link(camera); s.camera=camera; cam.type='ORTHO'
def camera_set(elev,scale):
    a=math.radians(elev); camera.location=(0,-12*cos(a),12*sin(a)); camera.rotation_euler=(-camera.location).to_track_quat('-Z','Y').to_euler(); cam.ortho_scale=scale
def freestyle(on):
    s.render.use_freestyle=on
    if on:
        st=bpy.context.view_layer.freestyle_settings.linesets[0]
        if st.linestyle is None: st.linestyle=bpy.data.linestyles.new('Warm umber 3.25px at 256')
        ls=st.linestyle
        ls.color=rgb('33271d')[:3]; ls.thickness=6.5
        st=bpy.context.view_layer.freestyle_settings.linesets[0]; st.select_crease=False
        st.select_by_collection=True;st.collection=noInk;st.collection_negation='EXCLUSIVE'
def save(name):
    key='floor_c11' if name=='c11_floor.blend' else ('dec_'+name[:-6] if name.startswith('c11_') else 'style_preview')
    s.render.filepath=str(RAW/(key+'.png'))
    bpy.ops.file.pack_all()
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'src'/name),compress=True)
def render(name,n):
    s.render.resolution_x=n; s.render.resolution_y=n; s.render.filepath=str(RAW/(name+'.png'))
    bpy.ops.render.render(write_still=True)
camera_set(55,5.15); freestyle(True)
s.render.resolution_x=s.render.resolution_y=512
s['Art37_camera_elevation_deg']=55; s['Art37_sun_elevation_deg']=60
s['Art37_outline_at_256_px']=3.25; s['Art37_color_management']='Standard'
save('style_preset.blend')
# Floor: height/color field uses integer harmonics, so the same sample repeats at 10 units.
floorStart=set(bpy.data.objects)
fm=[mat('Floor soil '+str(i),h,False) for i,h in enumerate(['514432','554735','594a37','5d4e3a','61513d'])]
N=144
harmonics=[(random.randint(2,13),random.randint(-12,12),random.random()*2*pi,random.uniform(.3,1)) for _ in range(31)]
def field(x,y):
    u=x*2*pi/10; v=y*2*pi/10
    n=sum(w*sin(k*u+h*v+p) for k,h,p,w in harmonics)/9
    return n,0
vs=[]
for j in range(N+1):
    for i in range(N+1):
        x=-5+10*i/N; y=-5+10*j/N; n,ch=field(x,y)
        vs.append((x,y,-.08*ch+.018*n))
fs=[(j*(N+1)+i,j*(N+1)+i+1,(j+1)*(N+1)+i+1,(j+1)*(N+1)+i) for j in range(N) for i in range(N)]
o=mesh('Periodic compacted earth • 10m tile',vs,fs,fm[0])
for m in fm[1:]:o.data.materials.append(m)
for p in o.data.polygons:
    x,y,_=p.center; n,ch=field(x,y); p.material_index=max(0,min(4,round(2+n*1.5-ch*1.3)))
# Interpolate soil colors per vertex, avoiding polygon-sized color steps.
soil=mat('Floor • continuous periodic warm soil','594a37',False)
att=soil.node_tree.nodes.new('ShaderNodeAttribute');att.attribute_name='SoilTone'
em=next(n for n in soil.node_tree.nodes if n.type=='EMISSION');soil.node_tree.links.new(att.outputs['Color'],em.inputs[0])
o.data.materials.clear();o.data.materials.append(soil)
colors=o.data.color_attributes.new(name='SoilTone',type='FLOAT_COLOR',domain='POINT')
for i,v in enumerate(o.data.vertices):
    n,_=field(v.co.x,v.co.y);blend=max(0,min(1,.5+n*.5));lo=rgb('554735');hi=rgb('61513d')
    colors.data[i].color=tuple(lo[c]*(1-blend)+hi[c]*blend for c in range(4))
tunnel=mat('Floor • shallow tunnel marks','514431',False)
for i in range(14):
    x=random.uniform(-5,5);y=random.uniform(-5,5);a=random.uniform(0,2*pi);length=random.uniform(.45,1.1)
    pts=[]
    for j in range(24):
        t=j/23-.5;xx=t*length;yy=.1*sin(t*4+.2*i);pts.append((x+xx*cos(a)-yy*sin(a),y+xx*sin(a)+yy*cos(a),.018))
    line('Tiny shallow ant tunnel',pts,.018,tunnel)
# Small details are evenly distributed and duplicated across every edge.
detail=[]
floorSpeck=[mat('Floor granule '+str(i),h,False) for i,h in enumerate(['65543e','4e4233','6b5942'])]
for i in range(300):
    x=random.uniform(-5,5); y=random.uniform(-5,5); r=random.uniform(.012,.043)
    detail.append(ico('Soil granule', (x,y,.015),(r*1.6,r,r*.35),random.choice(floorSpeck),1))
floorShell=mat('Floor seed husk muted','796548',False)
for i in range(27):
    x=random.uniform(-5,5); y=random.uniform(-5,5)
    ob=uv('Tiny broken husk',(x,y,.025),(.08,.034,.014),floorShell,12,6); ob.rotation_euler.z=random.uniform(0,pi); detail.append(ob)
floorAcid=mat('Floor acid fleck muted','70844c',False)
for i in range(18):
    x=random.uniform(-5,5); y=random.uniform(-5,5)
    detail.append(crystal('Tiny acid fleck',x,y,.015,.022,.035,floorAcid))
base=list(set(bpy.data.objects)-floorStart)
col=bpy.data.collections.new('Floor tile • periodic 3x3'); s.collection.children.link(col)
for ob in base:
    for c in list(ob.users_collection): c.objects.unlink(ob)
    col.objects.link(ob)
for dx in (-10,0,10):
    for dy in (-10,0,10):
        if dx==dy==0:continue
        for ob in base:
            cp=ob.copy(); cp.data=ob.data; col.objects.link(cp); cp.location.x+=dx;cp.location.y+=dy
camera_set(90,10); freestyle(False); s.render.film_transparent=False
s.render.resolution_x=s.render.resolution_y=2048
save('c11_floor.blend'); render('floor_c11',2048)
for ob in list(col.objects):bpy.data.objects.remove(ob,do_unlink=True)
bpy.data.collections.remove(col)
camera_set(55,5.15); freestyle(True); s.render.film_transparent=True
s.render.resolution_x=s.render.resolution_y=512
# Soft contact shadow: transparent shader, radial analytic falloff on a separate flat mesh.
def shadow():
    m=bpy.data.materials.new('Soft transparent contact shadow'); m.use_nodes=True
    n=m.node_tree.nodes;n.clear(); l=m.node_tree.links
    out=n.new('ShaderNodeOutputMaterial'); mix=n.new('ShaderNodeMixShader'); tr=n.new('ShaderNodeBsdfTransparent'); e=n.new('ShaderNodeEmission'); e.inputs[0].default_value=rgb('251e16')
    tc=n.new('ShaderNodeTexCoord'); sub=n.new('ShaderNodeVectorMath');sub.operation='SUBTRACT';sub.inputs[1].default_value=(.5,.5,0)
    length=n.new('ShaderNodeVectorMath');length.operation='LENGTH'
    ramp=n.new('ShaderNodeValToRGB');ramp.color_ramp.elements[0].position=.08;ramp.color_ramp.elements[0].color=(.24,.24,.24,1)
    ramp.color_ramp.elements[1].position=.5;ramp.color_ramp.elements[1].color=(0,0,0,1)
    l.new(tc.outputs['UV'],sub.inputs[0]);l.new(sub.outputs[0],length.inputs[0]);l.new(length.outputs['Value'],ramp.inputs[0]);l.new(ramp.outputs[0],mix.inputs[0]);l.new(tr.outputs[0],mix.inputs[1]);l.new(e.outputs[0],mix.inputs[2]);l.new(mix.outputs[0],out.inputs[0])
    bpy.ops.mesh.primitive_plane_add(size=2,location=(.1,.08,-.045));o=bpy.context.object;o.name='Soft contact shadow';o.scale=(1.85,1.3,1);o.data.materials.append(m);noInk.objects.link(o)
def mound():
    uv('Soft dirt mound',(0,0,.12),(1.48,.92,.48),earth)
    rim('Low sculpted ring',.52,.32,.49,.095,earthDark)
    uv('Small dark entrance',(0,-.01,.49),(.43,.26,.025),hole)
    for x,y,r in [(-1,-.6,.24),(.98,-.48,.2),(.58,.72,.17)]:ico('Earth clod',(x,y,.08),(r,r*.72,r*.54),earthLight)
def crystals():
    uv('Earthen base',(0,0,.015),(1.35,.69,.12),earthDark)
    for x,y,r,h in [(-.55,.03,.36,.93),(.04,.25,.43,1.15),(.62,-.1,.32,.7)]:
        crystal('Sour apple acid crystal',x,y,.09,r,h,acid)
        line('Candy glint',[(x-r*.33,y-r*.8,.2+h*.35),(x-r*.33,y-r*.8,.2+h*.58)],.025,acidHi)
def shells():
    # Two genuinely open concave seed-shell halves.
    for cx,cy,rot in [(-.65,.02,-.3),(.68,.2,.45)]:
        vs=[]; fs=[]; nu=24; nv=10
        for j in range(nv+1):
            theta=.13+(pi-.26)*j/nv
            for i in range(nu+1):
                a=pi*i/nu; x=.55*sin(theta)*cos(a); y=1.17*cos(theta); z=.16+.38*(1-sin(theta)*sin(a))
                vs.append((cx+x*cos(rot)-y*sin(rot),cy+x*sin(rot)+y*cos(rot),z))
        for j in range(nv):
            for i in range(nu):k=j*(nu+1)+i;fs.append((k,k+1,k+nu+2,k+nu+1))
        ob=mesh('Open broken seed husk',vs,fs,inner);ob.data.materials.append(seed)
        so=ob.modifiers.new('Shell wall','SOLIDIFY');so.thickness=.065;so.material_offset=1
        be=ob.modifiers.new('Soft shell rim','BEVEL');be.width=.04;be.segments=2
        for k in (-.24,0,.24):
            pts=[]
            for j in range(20):
                y=-.94+1.88*j/19; x=k*(1-(y/1.2)**2)**.5;z=.16+.38*(1-(1-(y/1.17)**2)**.5)+.035
                pts.append((cx+x*cos(rot)-y*sin(rot),cy+x*sin(rot)+y*cos(rot),z))
            line('Shell fibers',pts,.018,seed)
def cracker():
    vs=[(-1.2,-.65,.06),(.55,-.8,.06),(1.12,-.12,.06),(.74,.63,.06),(-.15,.79,.06),(-1.1,.28,.06)]
    vs+= [(x,y,.38+.018*sin(i*3)) for i,(x,y,z) in enumerate(vs.copy())]
    fs=[tuple(reversed(range(6))),tuple(range(6,12))]+[(i,(i+1)%6,(i+1)%6+6,i+6) for i in range(6)]
    ob=mesh('Broken cracker',vs,fs,crumb);ob.data.materials.append(crumbTop);ob.data.polygons[1].material_index=1
    b=ob.modifiers.new('Baked rounded edges','BEVEL');b.width=.1;b.segments=3
    for x,y in [(-.65,-.18),(-.2,.33),(.35,-.13)]:uv('Baked pore',(x,y,.397),(.09,.07,.012),seed,16,8)
    for x,y in [(-1.34,-.67),(1.24,.38),(.48,-1)]:ico('Cracker crumb',(x,y,.07),(.16,.12,.1),crumbTop)
def ant_hole():
    uv('Low earth apron',(0,0,.025),(1.5,.98,.12),earthDark)
    rim('Soft raised earth lip',1.02,.59,.13,.16,earth)
    uv('Recessed oval entrance',(0,0,.13),(.94,.51,.035),hole)
    line('Warm lit lip',[(-1.04+.075*i,-.58,.18+.025*sin(i*.25)) for i in range(21)],.04,earthLight)
    for x,y in [(-1.3,.3),(1.22,-.49),(.88,.8)]:ico('Loose ant soil',(x,y,.055),(.17,.12,.09),earth)
def leaf_bit():
    # Torn pointed leaf with a gentle central fold.
    vs=[(-1.42,-.04,.07),(-.96,-.43,.1),(-.3,-.68,.1),(.36,-.56,.13),(.76,-.29,.13),(1.32,.04,.08),(.68,.36,.15),(.3,.59,.14),(-.36,.51,.1),(-.9,.29,.08),(0,0,.26)]
    ob=mesh('Dry leaf fragment',vs,[(i,(i+1)%10,10) for i in range(10)],leaf)
    sol=ob.modifiers.new('Papery thickness','SOLIDIFY');sol.thickness=.035
    line('Leaf midrib',[(-1.32,0,.09),(0,0,.28),(1.3,.04,.1)],.029,vein)
    for x in (-.75,-.25,.3,.65):
        line('Leaf vein',[(x,0,.24),(x+.25,.34 if x<.5 else .2,.17)],.018,vein)
        line('Leaf vein',[(x,0,.24),(x+.18,-.38 if x<.4 else -.2,.16)],.018,vein)
    line('Leaf stem',[(-1.4,0,.07),(-1.75,-.14,.055)],.045,vein)
def puddle():
    n=72;vs=[(0,0,.11)]
    for i in range(n):
        a=i*2*pi/n;r=1+.09*sin(3*a)+.07*cos(5*a);vs.append((1.48*r*cos(a),.9*r*sin(a),.11))
    ob=mesh('Flat acid puddle',vs,[(0,i+1,(i+1)%n+1) for i in range(n)],acid)
    pts=vs[1:]+[vs[1]];line('Acid olive meniscus',pts,.065,acidDark)
    line('Liquid gloss crescent',[(-1+.065*i,-.52+.035*sin(i*.2),.135) for i in range(14)],.025,acidHi)
    for x,y,r in [(.6,.15,.16),(.9,.35,.08),(-.55,.2,.1)]:uv('Quiet bubble',(x,y,.13),(r,r,.045),acidHi,20,10)
def pebble():
    ico('Main rounded pebble',(-.25,.02,.22),(1.03,.72,.39),stone,2)
    ico('Small pebble',(.85,-.34,.12),(.36,.29,.19),earth,2)
    line('Pebble top glint',[(-.7,-.25,.53),(-.45,-.38,.55),(-.13,-.36,.57)],.026,inner)
builders={'dirt_mound':mound,'acid_crystal':crystals,'seed_shell':shells,'crumb':cracker,'ant_hole':ant_hole,'leaf_bit':leaf_bit,'acid_puddle':puddle,'pebble':pebble}
for key,fn in builders.items():
    before=set(bpy.data.objects);fn();shadow()
    objects=set(bpy.data.objects)-before
    c=bpy.data.collections.new('dec_c11_'+key);s.collection.children.link(c)
    for o in objects:
        for old in list(o.users_collection):
            if old!=noInk:old.objects.unlink(o)
        c.objects.link(o)
    save('c11_'+key+'.blend');render('dec_c11_'+key,512)
    for ob in list(c.objects):bpy.data.objects.remove(ob,do_unlink=True)
    bpy.data.collections.remove(c)
print('ART37_R1_RENDER_COMPLETE',str(OUT),flush=True)

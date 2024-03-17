import React, { useRef, useState, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Edges, CameraControls, Line, Text, Decal } from "@react-three/drei";
import { DoubleSide, Vector3, TextureLoader } from "three";
import img from "../public/mixergy_logo.png";

function Image(props) {
  const texture = useLoader(TextureLoader, img);

  return (
    <mesh>
      <cylinderGeometry args={[0.25, 0.25, 0.3, 32, 1, true, 5.4, 2]} />
      <meshBasicMaterial
        attach="material-0"
        map={texture}
        side={DoubleSide}
        transparent={true}
        opacity={props.opacity}
      />
    </mesh>
  );
}

export default function App() {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  function Radiator(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef();

    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    return (
      <mesh
        {...props}
        ref={mesh}
        onClick={(event) => {
          event.stopPropagation();
          const glowVec = new Vector3();
          mesh.current.getWorldPosition(glowVec);
          props.onClick(glowVec);
          setActive(!active);
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry
          args={[props.width, props.height ? props.height : 0.6, 0.1]}
        />
        <Edges color={"black"} />
        <meshStandardMaterial color={"white"} />
        <Text color="red" fontSize={0.15} position={[0.1, 0.1, 0.1]} rotation={[0,0,0]} >
        38°C
        </Text>
      </mesh>
    );
  }

  function Boiler(props) {
    const mesh = useRef();
    const text = useRef();

    return (
      <mesh {...props} ref={mesh} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.4, 0.5, 0.9]} color={"white"} />
        <Edges />
        <meshBasicMaterial color={"white"} />
        <Text ref={text} color="black" fontSize={0.3} position={[0.21,0,0.2]} rotation={[Math.PI/2,Math.PI/2,0]} >
        ON
        </Text>
        <Text ref={text} color="red" fontSize={0.15} position={[0.21,0,-0.1]} rotation={[Math.PI/2,Math.PI/2,0]} >
        41°C
        </Text>
      </mesh>
    );
  }

  function Valve(props) {
    const [shiny, setShiny] = useState(false);

    const mesh = useRef();
    const info = useRef();

    var infoProps = { ...props };

    infoProps.position[1] = 0.1;

    console.log({ props });
    console.log({ infoProps });

    return (
      <group>
        {/* <mesh {...infoProps} ref={info}>
          <planeGeometry args={[0.5, 0.5, 1]} />
          <Edges />
          <meshPhongMaterial color={"gray"} side={DoubleSide} />
        </mesh> */}
        <mesh
          {...props}
          ref={mesh}
          onPointerOver={(e) => {
            console.log({ e });
            setShiny(true);
            setHovered(true);
          }}
          onPointerOut={() => {
            setShiny(false);
            setHovered(false);
          }}
        >
          <boxGeometry args={[0.06, 0.12, 0.06]} />
          <Edges />
          <meshPhongMaterial color={shiny ? 0xff00ff : "gray"} />
          {/* <meshBasicMaterial color={"gray"} /> */}
        </mesh>
      </group>
    );
  }

  function Room(props) {
    const mesh = useRef();

    const transparent = true;
    const opacity = 0;

    return (
      <mesh {...props} ref={mesh} debug>
        <boxGeometry args={[props.width, props.height, props.length]} />
        <meshBasicMaterial
          attach="material-0"
          color={"lightgrey"}
          side={DoubleSide}
          transparent={true}
          opacity={opacity}
        />
        {/*right*/}
        <meshBasicMaterial
          attach="material-1"
          color={"grey"}
          side={DoubleSide}
          transparent={transparent}
          opacity={opacity}
        />
        {/*left*/}
        <meshBasicMaterial
          attach="material-2"
          color={"grey"}
          side={DoubleSide}
          transparent={transparent}
          opacity={opacity}
        />
        {/*top*/}
        <meshBasicMaterial
          attach="material-3"
          color={"grey"}
          side={DoubleSide}
          transparent={false}
          opacity={opacity}
        />
        {/*bottom*/}
        <meshBasicMaterial
          attach="material-4"
          color={"grey"}
          side={DoubleSide}
          transparent={transparent}
          opacity={opacity}
        />
        {/*front*/}
        <meshBasicMaterial
          attach="material-5"
          color={"grey"}
          side={DoubleSide}
          transparent={transparent}
          opacity={opacity}
        />
        {/*back*/}
        <Edges />
        {props.children}
      </mesh>
    );
  }

  function Eddi(props) {
    const mesh = useRef();
    return [
      <mesh position={[-0.05, 0, -0.05]}>
        <cylinderGeometry args={[0.1, 0.1, 0.25, 32, 1, false, 4.7, 1.6]} />
        <meshBasicMaterial
          attach="material"
          color={"white"}
          side={DoubleSide}
          transparent={false}
          opacity={props.opacity}
        />
        <Edges />
      </mesh>,
      <mesh {...props} ref={mesh}>
        <boxGeometry args={[0.15, 0.25, 0.1]} />
        <meshBasicMaterial color={"grey"} />
      </mesh>,
      <mesh position={[0.07, 0, -0.05]}>
        <cylinderGeometry args={[0.1, 0.1, 0.25, 32, 1, false, 0, 1.6]} />
        <meshBasicMaterial
          attach="material"
          color={"white"}
          side={DoubleSide}
          transparent={false}
          opacity={props.opacity}
        />
        <Edges />
      </mesh>,
    ];
  }

  function Mixergy(props) {
    const mesh = useRef();

    const texture = useLoader(TextureLoader, img);

    const [active, setActive] = useState(false);

    const controllerProps = {
      ...props,
      position: [
        props.position[0],
        props.position[1] + 1.11,
        props.position[2],
      ],
    };
    const hotWaterProps = {
      ...props,
      position: [
        props.position[0],
        props.position[1] + 0.446,
        props.position[2],
      ],
    };
    const coldWaterProps = {
      ...props,
      position: [
        props.position[0],
        props.position[1] - 0.549,
        props.position[2],
      ],
    };

    return [
      <mesh
        key="tank"
        {...props}
        ref={mesh}
        onClick={(event) => {
          event.stopPropagation();
          setActive(!active);
          const glowVec = new Vector3();
          mesh.current.getWorldPosition(glowVec);
          props.onClick(glowVec);
        }}
      >
        <cylinderGeometry
          position={[props.position.x, props.position.y, props.position.z]}
          args={[0.4, 0.4, 2.1]}
        />
        <meshBasicMaterial
          color={"white"}
          side={DoubleSide}
          transparent={true}
          opacity={1}
        />
        <Image
          position={[2, 2, 2]}
          transparent={false}
          opacity={active ? 0.2 : 1}
        /> 
        <Decal
    position={[0, 0, 0]} // Position of the decal
    rotation={[0, 0, 0]} // Rotation of the decal (can be a vector or a degree in radians)
    scale={0.5} // Scale of the decal
  >
    <meshBasicMaterial map={texture} />
  </Decal>
        <Edges />
      </mesh>,
      <mesh key="controller" {...controllerProps}>
        <boxGeometry args={[0.3, 0.05, 0.15]} />
        <meshBasicMaterial color={"grey"} />
        <Edges />
      </mesh>,
      <mesh key="cold-water" {...coldWaterProps}>
        <cylinderGeometry args={[0.22, 0.22, 1.0]} />
        <meshBasicMaterial color={"blue"} transparent={false} opacity={1} />
        <Edges />
      </mesh>,
      <mesh key="hot-water" {...hotWaterProps}>
        <cylinderGeometry args={[0.22, 0.22, 1.0]} />
        <meshBasicMaterial color={"red"} transparent={false} opacity={1} />
        <Edges />
      </mesh>,
    ];
  }

  function House() {
    const [zoomed, setZoomed] = useState(false);

    const rooms = [];

    rooms.push({
      x: 0,
      y: 0,
      z: 0,
      width: 3.6,
      length: 3.6,
      name: "Sitting Room",
      radiators: [
        {
          x: -1.7,
          y: -0.9,
          z: 0,
          rotationY: 3.14 / 2,
          width: 1.6,
          height: 0.6,
        },
      ],
    });
    rooms.push({
      x: 0,
      y: 0,
      z: 3.6,
      width: 3.6,
      length: 5,
      name: "Living Room",
      radiators: [
        {
          x: -0.4,
          y: -0.9,
          z: -2.4,
          rotationY: 0,
          width: 1.6,
          height: 0.6,
        },
      ],
    });
    rooms.push({
      x: 3.6,
      y: 0,
      z: 0,
      width: 2.1,
      length: 6.6,
      name: "Hallway",
      radiators: [
        {
          x: -0.95,
          y: -0.9,
          z: -2.4,
          rotationY: 3.14 / 2,
          width: 1.0,
          height: 0.6,
        },
      ],
    });
    rooms.push({
      x: 5.7,
      y: 0,
      z: 0,
      width: 2.5,
      length: 4.6,
      name: "Garage",
      appliances: [
        { type: "mixergy", position: { x: 0.7, y: -0.2, z: 1.8 } },
        { type: "boiler", position: { x: -1.03, y: 0.2, z: 1.1 } },
        { type: "valve", position: { x: 0.15, y: 0.5, z: 2.25 } },
      ],
    });
    rooms.push({
      x: 5.7,
      y: 0,
      z: 4.6,
      width: 2.5,
      length: 2.0,
      name: "Utility",
    });
    rooms.push({
      x: 3.6,
      y: 0,
      z: 6.6,
      width: 4.6,
      length: 6.0,
      name: "Kitchen",
      radiators: [
        {
          x: 2.15,
          y: -0.2,
          z: -1.3,
          rotationY: 3.14 / 2,
          width: 0.5,
          height: 1.8,
        },
      ],
    });
    rooms.push({
      x: 0,
      y: 2.5,
      z: 0,
      width: 3.6,
      length: 3.6,
      name: "Front Bedroom",
      radiators: [
        {
          x: 0,
          y: -0.9,
          z: -1.7,
          rotationY: 0,
          width: 1.4,
          height: 0.6,
        },
      ],
    });
    rooms.push({
      x: 0,
      y: 2.5,
      z: 3.6,
      width: 3.6,
      length: 5,
      name: "Master Bedroom",
      radiators: [
        {
          x: 0,
          y: -0.9,
          z: 2.4,
          rotationY: 0,
          width: 2.0,
          height: 0.6,
        },
      ],
    });
    rooms.push({
      x: 3.6,
      y: 2.5,
      z: 0,
      width: 2.9,
      length: 2.1,
      name: "Office",
      radiators: [
        {
          x: 0,
          y: -0.9,
          z: -0.96,
          rotationY: 0,
          width: 1.0,
          height: 0.6,
        },
      ],
    });
    rooms.push({
      x: 6.5,
      y: 2.5,
      z: 0,
      width: 1.7,
      length: 3.6,
      name: "Bathroom",
      radiators: [
        {
          x: 0,
          y: -0.2,
          z: 1,
          rotationY: 0,
          width: 0.5,
          height: 1.8,
        },
      ],
    });
    rooms.push({
      x: 3.6,
      y: 2.5,
      z: 5,
      width: 2.6,
      length: 3.6,
      name: "Back Bedroom",
      radiators: [
        {
          x: 0,
          y: -0.9,
          z: 1.7,
          rotationY: 0,
          width: 1.4,
          height: 0.6,
        },
      ],
    });

    const handleZoom = (position) => {
      if (zoomed) {
        camera.current.setLookAt(-4.4, 0, -8, 0, 0, 0, true);
      } else {
        camera.current.setLookAt(
          position.x,
          position.y,
          -0.2,
          position.x,
          position.y,
          position.z - 0.2,
          true
        );
      }

      setZoomed(!zoomed);
    };

    const roomElements = rooms.map((r) => {
      // Compute the position, offseting by width, length and height.
      //
      const offsetX = r.width / 2;
      const offsetZ = r.length / 2;

      const position = [-offsetX + -r.x, r.y, offsetZ + r.z];

      const radiators = r.radiators?.map((r, i) => (
        <Radiator
          key={`${r.name}_radiator_${i}`}
          position={[r.x, r.y, r.z]}
          rotation={[0, r.rotationY, 0]}
          width={r.width}
          height={r.height}
          onClick={handleZoom}
        />
      ));

      const appliances = r.appliances?.map((r) => {
        if (r.type === "mixergy") {
          return (
            <Mixergy
              key="mixergy"
              onClick={handleZoom}
              position={[r.position.x, r.position.y, r.position.z]}
            />
          );
        } else if (r.type === "boiler") {
          return (
            <Boiler
              key="boiler"
              onClick={handleZoom}
              position={[r.position.x, r.position.y, r.position.z]}
            />
          );
        } else if (r.type === "eddi") {
          return (
            <Eddi
              key="eddi"
              onClick={handleZoom}
              position={[r.position.x, r.position.y, r.position.z]}
            />
          );
        } else if (r.type === "valve") {
          return (
            <Valve
              key="valve"
              onClick={handleZoom}
              position={[r.position.x, r.position.y, r.position.z]}
            />
          );
        } else {
          return <></>;
        }
      });

      return (
        <Room
          key={r.name}
          position={position}
          name={r.name}
          width={r.width}
          length={r.length}
          height={2.5}
        >
          {radiators}
          {appliances}
        </Room>
      );
    });

    //

    return (
      <group>
        {roomElements}
        {/* <mesh rotation={[0, -Math.PI / 4, 0]} position={[-3.5, 6.8, 3.5]}>
          <cylinderGeometry attach="geometry" args={[0, 5, 4, 4]} />
          <Edges />
        </mesh> */}
        {/* <Line
          points={[
            [-5.6, -1.1, 0.4],
            [-5.6, -1.1, 0.3],
            [-5.72, -1.1, 0.3],
            [-5.72, -1.1, 4.55],
            [-6.8, -1.1, 4.55],
            [-6.8, 1.2, 4.55],
            [-8.15, 1.2, 4.55],
            [-8.15, 1.2, 3.6],
            [-8.15, 0.5, 3.6],
          ]}
          lineWidth={5}
          color={"red"}
        >
          <bufferGeometry />
        </Line> */}




        <Line
          points={[
            [-5.6, -1.12, 1.4],
            [-5.6, -1.12, 1.5],
            [-5.74, -1.12, 1.5],
            [-5.74, -1.12, 4.55],
            [-6.84, -1.12, 4.55],
            [-6.84, 1.16, 4.55],
            [-8.15, 1.16, 4.55],
            [-8.15, 1.16, 3.64],
            [-8.15, 0.5, 3.64],
          ]}
          lineWidth={5}
          color={"blue"}
        >
          <bufferGeometry />
        </Line>



        <Line
          points={[
            [-8.15, 0.2, 4.55],
            [-8.15, 3.5, 3.6],
          ]}
          lineWidth={5}
          color={"purple"}
        >
          <bufferGeometry />
        </Line>










      </group>
    );
  }

  const camera = useRef();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Canvas camera={{ fov: 50, near: 0.1, position: [10, 10, 10] }}>
        <ambientLight />
        <House />
        <CameraControls ref={camera} position={[0, 0, 0]} target={[0, 0, 0]} />
        <axesHelper />
      </Canvas>
    </div>
  );
}

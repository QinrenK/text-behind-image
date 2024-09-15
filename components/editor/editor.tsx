import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Design } from '@/types'
import { removeBackground } from "@imgly/background-removal";
import { Accordion } from "@/components/ui/accordion"
import { Button } from '../ui/button';
import TextCustomizer from './text-customizer';

interface EditorProps {
    design: Design[]
}

const Editor: React.FC<EditorProps> = ({ design }) => {
    const [isImageSetupDone, setIsImageSetupDone] = useState<boolean>(false)
    const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(null)
    const [textSets, setTextSets] = useState([
        {
            id: 1,
            text: 'edit',
            top: 0,
            left: 0,
            color: 'white',
            fontSize: 200,
            fontWeight: 800,
        }
    ]);

    const setupImage = async () => {
        try {
            const imageUrl = design[0].image;
            const imageBlob = await removeBackground(imageUrl);
            const url = URL.createObjectURL(imageBlob);

            console.log('url:', url);
            setRemovedBgImageUrl(url);
            setIsImageSetupDone(true)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setupImage()
    }, [design]);

    const handleAttributeChange = (id: number, attribute: string, value: any) => {
        setTextSets(prev => prev.map(set => 
            set.id === id ? { ...set, [attribute]: value } : set
        ));
    }

    const addNewTextSet = () => {
        const newId = Math.max(...textSets.map(set => set.id), 0) + 1;
        setTextSets(prev => [...prev, {
            id: newId,
            text: 'edit',
            top: 0,
            left: 0,
            color: 'white',
            fontSize: 200,
            fontWeight: 800,
        }]);
    }

    const removeTextSet = (id: number) => {
        setTextSets(prev => prev.filter(set => set.id !== id));
    }

    return (
        <div className='flex flex-row items-start justify-start gap-10 w-full h-screen'>
            <div className="min-h-[400px] w-[80%] p-4 md:min-h-[700px] lg:min-h-[700px] border border-border rounded-lg relative overflow-hidden">
                <Image
                    src={design[0].image}
                    alt={design[0].name}
                    layout="fill"
                    objectFit="contain" 
                    objectPosition="center" 
                    className={`${!isImageSetupDone ? 'animate-pulse' : ''}`}
                />
                {isImageSetupDone && textSets.map(textSet => (
                    <div
                        key={textSet.id}
                        contentEditable
                        suppressContentEditableWarning
                        style={{
                            position: 'absolute',
                            top: `${50 - textSet.top}%`,
                            left: `${textSet.left + 50}%`,
                            transform: 'translate(-50%, -50%)',
                            color: textSet.color,
                            textAlign: 'center',
                            fontSize: `${textSet.fontSize}px`,
                            fontWeight: textSet.fontWeight,
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                        }}
                    >
                        {textSet.text}
                    </div>
                ))}
                {removedBgImageUrl && (
                    <Image
                        src={removedBgImageUrl}
                        alt="Removed bg"
                        layout="fill"
                        objectFit="contain" 
                        objectPosition="center" 
                        className="absolute top-0 left-0 w-full h-full"
                    />
                )}
            </div>
            <div className='flex flex-col w-full'>
                <Button onClick={addNewTextSet}>Add New Text Set</Button>
                <Accordion type="single" collapsible className="w-full mt-2">
                    {textSets.map(textSet => (
                        <TextCustomizer 
                            key={textSet.id}
                            textSet={textSet}
                            handleAttributeChange={handleAttributeChange}
                            removeTextSet={removeTextSet}
                        />
                    ))}
                </Accordion>
            </div>
        </div>
    )
} 

export default Editor
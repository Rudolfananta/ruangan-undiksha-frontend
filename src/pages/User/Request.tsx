import useSWR from 'swr';
import { UserLayout } from '@/components/layouts/UserLayout';
import { RoleProtector } from '@/components/role-protector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import apiService, { apiServiceFetcher } from '@/lib/apiService';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown, CircleMinusIcon, MinusIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DatePickerWithYear } from '@/components/date-picker';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
    unit_id: z.number(),
    room_id: z.number(),
    date: z.string(),
    time_start: z.string(),
    time_end: z.string(),
});

export default function UserRequestPage() {
    const { toast } = useToast();
    const navigate = useNavigate();

    const [isAvailable, setIsAvailable] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const { data: units, isLoading: unitLoading } = useSWR('/units', apiServiceFetcher);
    const { data: rooms, isLoading: roomLoading } = useSWR('/rooms', apiServiceFetcher);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            unit_id: '',
            room_id: '',
            date: '',
            time_start: '',
            time_end: '',
        }
    });

    const roomId = form.watch('room_id');
    const selectedDate = form.watch('date');

    useEffect(() => {
        setIsChecking(true);
        apiService().post('/room-requests/check-availability', {
            room_id: roomId,
            date: selectedDate,
        })
            .then((response) => {
                setIsAvailable(
                    response.data.available ? true : false
                );
            })
            .catch(() => {
                setIsAvailable(false);
            })
            .finally(() => {
                setIsChecking(false);
            });
    }, [roomId, selectedDate]);

    const handleSubmit = useCallback((values: z.infer<typeof formSchema>) => {
        setIsChecking(true);

        apiService().post('/room-requests', values)
            .then(() => {
                setTimeout(() => {
                    navigate('/user');
                }, 1000);

                toast({
                    title: 'Booking berhasil!',
                    description: 'Ruangan berhasil di booking.',
                });
            })
            .catch(() => {
                toast({
                    title: 'Booking gagal!',
                    description: 'Ruangan gagal di booking.'
                });

                setIsChecking(false);
            });
    }, []);

    return (
        <RoleProtector role="user">
            <UserLayout className="flex justify-center ">
                <div className="w-full md:w-[500px]">
                    <Card className="mt-10 md:shadow-2xl">
                        <CardHeader>
                            <CardTitle>Booking Ruangan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                roomId
                                && selectedDate
                                && !isChecking
                                && !isAvailable
                                && (
                                    <Alert variant="destructive" className="mb-4">
                                        <CircleMinusIcon className="h-4 w-4" />
                                        <AlertTitle>Ruangan tidak bisa digunakan!</AlertTitle>
                                        <AlertDescription>
                                            Ruangan sedang digunakan oleh pihak lain.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            <Form {...form}>
                                {/* @ts-ignore */}
                                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                                    <FormField
                                        name="unit_id"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Unit</FormLabel>
                                                <FormControl>
                                                    {
                                                        unitLoading
                                                            ? <Skeleton />
                                                            : <DynamicSelector
                                                                items={units}
                                                                onChange={field.onChange} />
                                                    }
                                                </FormControl>
                                                <FormDescription>
                                                    Pilih unit yang akan melakukan booking.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    <FormField
                                        name="room_id"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ruangan</FormLabel>
                                                <FormControl>
                                                    {
                                                        roomLoading
                                                            ? <Skeleton />
                                                            : <DynamicSelector
                                                                items={rooms}
                                                                onChange={field.onChange} />
                                                    }
                                                </FormControl>
                                                <FormDescription>
                                                    Pilih ruangan yang akan di booking.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>

                                        )} />
                                    <FormField
                                        name="date"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tanggal</FormLabel>
                                                <FormControl>
                                                    <DatePickerWithYear
                                                        onChange={field.onChange} />
                                                </FormControl>
                                                <FormDescription>
                                                    Pilih tanggal booking.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>

                                        )} />
                                    <div className="grid grid-cols-12 items-center">
                                        <div className="col-span-5">
                                            <FormField
                                                name="time_start"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Jam mulai</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="time"
                                                                onChange={field.onChange} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Masukkan jam mulai.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>

                                                )} />
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            <MinusIcon />
                                        </div>
                                        <div className="col-span-5">
                                            <FormField
                                                name="time_end"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Jam selesai</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="time"
                                                                onChange={field.onChange} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Masukkan jam selesai.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                        </div>
                                    </div>
                                    <Button
                                        disabled={isChecking || !isAvailable}
                                        type="submit"
                                        className="w-full">
                                        Submit
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </UserLayout>
        </RoleProtector>
    );
}

function DynamicSelector({
    items,
    onChange,
}: {
    items: any,
    onChange: (value: string) => void,
}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? items.find((item: any) => item.name === value)?.name
                        : "Select item..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search item..." />
                    <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                            {items.map((item: any) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.id}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        onChange?.(item.id)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === item.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
